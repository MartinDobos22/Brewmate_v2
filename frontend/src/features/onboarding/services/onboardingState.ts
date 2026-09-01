import type { OnboardingState, User } from '@brewmate/shared';

import {
  ONBOARDING_FLOW_VERSION,
  ONBOARDING_STEPS,
  type OnboardingStep,
} from '../constants/onboardingSteps';

import { isOnboardingStep } from './onboardingSteps';

const withoutStep = (steps: readonly string[], step: OnboardingStep): readonly string[] =>
  steps.filter((completed: string): boolean => completed !== step);

/** A user who has never opened the flow, expressed as state rather than as null. */
export const initialOnboardingState = (): OnboardingState => ({
  version: ONBOARDING_FLOW_VERSION,
  completedSteps: [],
  currentStep: ONBOARDING_STEPS.welcome,
  completedAt: null,
  questionnaireAnswers: {},
  questionnaireLevel: null,
});

/**
 * The stored state, or a fresh one.
 *
 * A state written by an older version of the flow is started over rather than
 * resumed: "you were on step five" means nothing once step five is a different
 * screen. The questionnaire answers are dropped with it for the same reason -
 * they name options that may no longer exist.
 */
export const readOnboardingState = (user: User | undefined): OnboardingState => {
  const stored = user?.onboardingState ?? null;

  return stored?.version === ONBOARDING_FLOW_VERSION ? stored : initialOnboardingState();
};

/** Where to carry on, for a state that was left partway through. */
export const resumeStep = (state: OnboardingState): OnboardingStep => {
  const stored = state.currentStep;

  return stored !== null && isOnboardingStep(stored) ? stored : ONBOARDING_STEPS.welcome;
};

/** True once the user has left the flow for good, whether finished or skipped. */
export const isOnboardingFinished = (state: OnboardingState): boolean => state.completedAt !== null;

export const withStepCompleted = (
  state: OnboardingState,
  step: OnboardingStep,
  next: OnboardingStep | null,
): OnboardingState => ({
  ...state,
  completedSteps: [...withoutStep(state.completedSteps, step), step],
  currentStep: next,
});

export const withAnswers = (
  state: OnboardingState,
  questionnaireAnswers: Readonly<Record<string, string>>,
): OnboardingState => ({ ...state, questionnaireAnswers: { ...questionnaireAnswers } });

/**
 * Which set of questions the stored answers belong to.
 *
 * Saved before the first question is shown rather than with the submission,
 * because it is what makes a run resumable: the answers on their own do not
 * say which questionnaire they came from, and read against the wrong one they
 * are evidence about questions nobody was asked.
 */
export const withQuestionnaireLevel = (
  state: OnboardingState,
  questionnaireLevel: string,
): OnboardingState => ({ ...state, questionnaireLevel });

/**
 * Leaving early.
 *
 * `currentStep` deliberately stays where the user was standing while
 * `completedAt` records that they left: together they are what makes
 * "pokračovať" resume rather than restart, without a third field that could
 * contradict the other two.
 */
export const asLeftEarly = (state: OnboardingState, step: OnboardingStep): OnboardingState => ({
  ...state,
  currentStep: step,
  completedAt: new Date().toISOString(),
});

/** Reaching the end. `currentStep` is cleared, which is what says "finished". */
export const asCompleted = (state: OnboardingState): OnboardingState => ({
  ...state,
  completedSteps: [
    ...withoutStep(state.completedSteps, ONBOARDING_STEPS.done),
    ONBOARDING_STEPS.done,
  ],
  currentStep: null,
  completedAt: new Date().toISOString(),
});
