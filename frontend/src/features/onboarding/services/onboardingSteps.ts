import {
  ONBOARDING_PROGRESS_STEPS,
  ONBOARDING_STEP_ORDER,
  type OnboardingProgressStep,
  type OnboardingStep,
} from '../constants/onboardingSteps';

const NOT_FOUND = -1;
const FIRST = 0;
const NEXT = 1;

const KNOWN_STEPS: readonly string[] = ONBOARDING_STEP_ORDER;
const PROGRESS_STEPS: readonly string[] = ONBOARDING_PROGRESS_STEPS;

export const isOnboardingStep = (value: string): value is OnboardingStep =>
  KNOWN_STEPS.includes(value);

export const isProgressStep = (step: OnboardingStep): step is OnboardingProgressStep =>
  PROGRESS_STEPS.includes(step);

/** The step after this one, or `null` at the end of the flow. */
export const nextOnboardingStep = (step: OnboardingStep): OnboardingStep | null =>
  ONBOARDING_STEP_ORDER[ONBOARDING_STEP_ORDER.indexOf(step) + NEXT] ?? null;

/** The step before this one, or `null` at the start. */
export const previousOnboardingStep = (step: OnboardingStep): OnboardingStep | null => {
  const index = ONBOARDING_STEP_ORDER.indexOf(step);

  return index <= FIRST ? null : (ONBOARDING_STEP_ORDER[index - NEXT] ?? null);
};

export interface StepProgress {
  /** One-based, so it reads the way "krok 3 zo 7" does. */
  readonly current: number;
  readonly total: number;
}

/** Where the bar stands, or `null` on a screen the bar does not count. */
export const readStepProgress = (step: OnboardingStep): StepProgress | null => {
  const index = PROGRESS_STEPS.indexOf(step);

  return index === NOT_FOUND
    ? null
    : { current: index + NEXT, total: ONBOARDING_PROGRESS_STEPS.length };
};
