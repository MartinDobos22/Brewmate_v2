import { useRouter } from 'expo-router';

import { ROUTES } from '../../../constants/routes';
import { ONBOARDING_STEPS } from '../../onboarding/constants';
import { useOnboardingStepLink } from '../../onboarding/hooks';
import { GETTING_STARTED_STEPS, type GettingStartedStepId } from '../constants';

/**
 * Where each of the first three steps leads.
 *
 * One function rather than a route on each row, because two places offer the
 * same three steps - the rows themselves and the button under them - and two
 * copies of this would eventually send somebody to two different screens for
 * the same step.
 *
 * Writing a coffee down leads to the cupboard's camera rather than to the
 * cupboard: the step is about getting a first coffee into the app, and
 * photographing a bag is the shortest way there. Typing it in is on the same
 * screen, and asking about a bag in a shop has a tab of its own - so the step
 * is done whichever of the two somebody reaches for.
 */
export const useOpenGettingStartedStep = (): ((id: GettingStartedStepId) => void) => {
  const router = useRouter();
  const openStep = useOnboardingStepLink();

  return (id: GettingStartedStepId): void => {
    if (id === GETTING_STARTED_STEPS.taste) {
      openStep(ONBOARDING_STEPS.taste);

      return;
    }

    router.push(id === GETTING_STARTED_STEPS.coffee ? ROUTES.addBag : ROUTES.quickBrew);
  };
};
