import type { JSX } from 'react';

import { Button, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { ONBOARDING_STEPS } from '../../constants/onboardingSteps';
import { TasteProfileChart } from '../../../tasteProfile/components';
import { useTasteProfile } from '../../../tasteProfile/hooks';
import type { OnboardingFlow } from '../../hooks/useOnboardingFlow';
import { OnboardingStepLayout } from '../OnboardingStepLayout';

export interface DoneStepProps {
  readonly flow: OnboardingFlow;
}

/**
 * The closing screen shows the profile that was just built.
 *
 * Ten questions that vanish into a server feel like a form. The same ten
 * drawn as five bars are visibly the reason the next recommendation looks the
 * way it does.
 */
export const DoneStep = ({ flow }: DoneStepProps): JSX.Element => {
  const { t } = useTranslation();
  const { data: profile } = useTasteProfile();

  return (
    <OnboardingStepLayout step={ONBOARDING_STEPS.done} flow={flow}>
      <Text variant="headlineMedium">{t(TRANSLATION_KEYS.onboardingDoneTitle)}</Text>
      <Text variant="bodyLarge">{t(TRANSLATION_KEYS.onboardingDoneBody)}</Text>
      {profile === undefined ? null : <TasteProfileChart axes={profile} />}
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.onboardingDoneProfileHint)}
      </Text>
      <Button label={t(TRANSLATION_KEYS.onboardingDoneAction)} onPress={flow.goNext} fullWidth />
    </OnboardingStepLayout>
  );
};
