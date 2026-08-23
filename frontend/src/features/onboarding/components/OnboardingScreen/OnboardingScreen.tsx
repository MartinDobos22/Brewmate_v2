import type { JSX } from 'react';

import { Screen, STACK_SCREEN_EDGES } from '../../../../components/layout';
import { LoadingState } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useOnboardingFlow } from '../../hooks/useOnboardingFlow';
import { OnboardingStepContent } from '../OnboardingStepContent';

/**
 * The whole flow, on one route.
 *
 * One route rather than nine, because the steps are a single conversation:
 * going back a step must not pop somebody out of onboarding, and the resume
 * point is a value on the server rather than a URL somebody might bookmark.
 */
export const OnboardingScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const flow = useOnboardingFlow();

  return (
    <Screen edges={STACK_SCREEN_EDGES}>
      {flow.step === null ? (
        <LoadingState label={t(TRANSLATION_KEYS.stateLoading)} />
      ) : (
        <OnboardingStepContent step={flow.step} flow={flow} />
      )}
    </Screen>
  );
};
