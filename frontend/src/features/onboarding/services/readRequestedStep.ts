import type { OnboardingStep } from '../constants/onboardingSteps';

import { isOnboardingStep } from './onboardingSteps';

const FIRST = 0;

/**
 * The step named in the route, when the profile screen opened one on its own.
 *
 * expo-router hands a parameter through as either a string or an array of
 * them, and anything that is not a step Brewmate knows is treated as absent -
 * a typed URL must not drop somebody into a screen that does not exist.
 */
export const readRequestedStep = (
  parameter: string | readonly string[] | undefined,
): OnboardingStep | null => {
  const value = typeof parameter === 'string' ? parameter : parameter?.[FIRST];

  return value !== undefined && isOnboardingStep(value) ? value : null;
};
