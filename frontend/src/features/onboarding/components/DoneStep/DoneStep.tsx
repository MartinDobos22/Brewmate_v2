import type { JSX } from 'react';

import { Button, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { ONBOARDING_STEPS } from '../../constants/onboardingSteps';
import { TasteRadarChart } from '../../../tasteProfile/components';
import { useTasteProfile } from '../../../tasteProfile/hooks';
import type { OnboardingFlow } from '../../hooks/useOnboardingFlow';
import { OnboardingStepLayout } from '../OnboardingStepLayout';

export interface DoneStepProps {
  readonly flow: OnboardingFlow;
}

/**
 * The closing screen shows the profile that was just built.
 *
 * A questionnaire that vanishes into a server feels like a form. The same
 * answers drawn as a shape are visibly the reason the next recommendation
 * looks the way it does - and the vertices it has not earned yet are visibly
 * the reason to come back and describe a cup.
 */
export const DoneStep = ({ flow }: DoneStepProps): JSX.Element => {
  const { t } = useTranslation();
  const { data: profile } = useTasteProfile();

  return (
    <OnboardingStepLayout step={ONBOARDING_STEPS.done} flow={flow}>
      <Text variant="headlineMedium">{t(TRANSLATION_KEYS.onboardingDoneTitle)}</Text>
      <Text variant="bodyLarge">{t(TRANSLATION_KEYS.onboardingDoneBody)}</Text>
      {profile === undefined ? null : (
        <TasteRadarChart axes={profile} axisConfidence={profile.axisConfidence} />
      )}
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.onboardingDoneProfileHint)}
      </Text>
      <Button label={t(TRANSLATION_KEYS.onboardingDoneAction)} onPress={flow.goNext} fullWidth />
    </OnboardingStepLayout>
  );
};
