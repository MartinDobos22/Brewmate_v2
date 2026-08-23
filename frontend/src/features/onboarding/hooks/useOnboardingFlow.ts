import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import type { OnboardingState } from '@brewmate/shared';

import { ROUTES } from '../../../constants';
import {
  ONBOARDING_STEPS,
  ONBOARDING_STEP_PARAM,
  type OnboardingStep,
} from '../constants/onboardingSteps';
import {
  asCompleted,
  asLeftEarly,
  resumeStep,
  withStepCompleted,
} from '../services/onboardingState';
import {
  nextOnboardingStep,
  previousOnboardingStep,
  readStepProgress,
  type StepProgress,
} from '../services/onboardingSteps';
import { readRequestedStep } from '../services/readRequestedStep';

import { useOnboardingState } from './useOnboardingState';

export interface OnboardingFlow {
  /** Null until `/me` has answered and the resume point is known. */
  readonly step: OnboardingStep | null;
  readonly progress: StepProgress | null;
  /** True when the profile screen opened one step rather than the whole flow. */
  readonly isSingleStep: boolean;
  readonly state: OnboardingState;
  readonly saveState: (next: OnboardingState) => void;
  readonly canGoBack: boolean;
  readonly goBack: () => void;
  readonly goNext: () => void;
  readonly leave: () => void;
  readonly isSaving: boolean;
  readonly hasFailed: boolean;
}

type AppRouter = ReturnType<typeof useRouter>;

const leaveFlow = (router: AppRouter, isSingleStep: boolean): void => {
  if (isSingleStep && router.canGoBack()) {
    router.back();

    return;
  }

  router.replace(ROUTES.home);
};

/**
 * The step machine behind the onboarding route.
 *
 * The visible step is local state and the server copy trails it, so tapping
 * "pokračovať" never waits for a round trip. What the server holds is where
 * the user would land on a cold start, which is the only thing it is needed
 * for.
 */
export const useOnboardingFlow = (): OnboardingFlow => {
  const router = useRouter();
  const parameters = useLocalSearchParams();
  const requested = readRequestedStep(parameters[ONBOARDING_STEP_PARAM]);
  const store = useOnboardingState();
  const [step, setStep] = useState<OnboardingStep | null>(requested);

  useEffect((): void => {
    if (step === null && store.isReady) {
      setStep(resumeStep(store.state));
    }
  }, [step, store.isReady, store.state]);

  const isSingleStep = requested !== null;

  const move = (next: OnboardingStep | null, updated: OnboardingState): void => {
    store.save(updated);

    if (next === null) {
      leaveFlow(router, isSingleStep);

      return;
    }

    setStep(next);
  };

  return {
    step,
    isSingleStep,
    state: store.state,
    saveState: store.save,
    isSaving: store.isSaving,
    hasFailed: store.hasFailed,
    progress: step === null ? null : readStepProgress(step),
    canGoBack: !isSingleStep && step !== null && previousOnboardingStep(step) !== null,

    goBack: (): void => {
      const previous = step === null ? null : previousOnboardingStep(step);

      if (previous !== null) {
        setStep(previous);
      }
    },

    goNext: (): void => {
      if (step === null) {
        return;
      }

      /**
       * A step reopened on its own has already saved whatever it changed.
       * Marking the whole flow finished here would be a lie about a user who
       * only came back to redo the questionnaire.
       */
      if (isSingleStep) {
        leaveFlow(router, isSingleStep);

        return;
      }

      if (step === ONBOARDING_STEPS.done) {
        move(null, asCompleted(store.state));

        return;
      }

      const next = nextOnboardingStep(step);

      move(next, withStepCompleted(store.state, step, next));
    },

    leave: (): void => {
      if (step !== null && !isSingleStep) {
        store.save(asLeftEarly(store.state, step));
      }

      leaveFlow(router, isSingleStep);
    },
  };
};
