import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { ROUTES } from '../../../constants';
import { ONBOARDING_STEP_PARAM, type OnboardingStep } from '../constants/onboardingSteps';

/**
 * Reopens one onboarding step on its own.
 *
 * The profile screen is the flow's control panel: "vyplniť dotazník znova" and
 * "upraviť vybavenie" are the same screens the user already answered once, so
 * they are reached rather than rebuilt. The step comes back to where it was
 * opened from instead of carrying on through the flow.
 */
export const useOnboardingStepLink = (): ((step: OnboardingStep) => void) => {
  const router = useRouter();

  return useCallback(
    (step: OnboardingStep): void => {
      router.push({ pathname: ROUTES.onboarding, params: { [ONBOARDING_STEP_PARAM]: step } });
    },
    [router],
  );
};
