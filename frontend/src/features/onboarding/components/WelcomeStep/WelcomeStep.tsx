import type { JSX } from 'react';

import { Button, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { ONBOARDING_STEPS } from '../../constants/onboardingSteps';
import type { OnboardingFlow } from '../../hooks/useOnboardingFlow';
import { OnboardingStepLayout } from '../OnboardingStepLayout';

export interface WelcomeStepProps {
  readonly flow: OnboardingFlow;
}

/** What is about to happen, how long it takes, and that it can be stopped. */
export const WelcomeStep = ({ flow }: WelcomeStepProps): JSX.Element => {
  const { t } = useTranslation();
  const isResuming = flow.state.completedSteps.length > 0;

  return (
    <OnboardingStepLayout step={ONBOARDING_STEPS.welcome} flow={flow}>
      <Text variant="headlineMedium">{t(TRANSLATION_KEYS.onboardingWelcomeTitle)}</Text>
      <Text variant="bodyLarge">{t(TRANSLATION_KEYS.onboardingWelcomeBody)}</Text>
      <Text variant="bodyMedium" tone="muted">
        {t(TRANSLATION_KEYS.onboardingWelcomeDuration)}
      </Text>
      {isResuming ? (
        <Text variant="bodySmall" tone="secondary">
          {t(TRANSLATION_KEYS.onboardingResumeNotice)}
        </Text>
      ) : null}
      <Button label={t(TRANSLATION_KEYS.onboardingWelcomeAction)} onPress={flow.goNext} fullWidth />
    </OnboardingStepLayout>
  );
};
