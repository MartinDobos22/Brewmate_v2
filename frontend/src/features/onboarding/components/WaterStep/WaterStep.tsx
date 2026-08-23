import { WATER_TYPES, type WaterType } from '@brewmate/shared';
import type { JSX } from 'react';

import { Button, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useCurrentUser } from '../../../auth';
import { WaterTypePicker } from '../../../inventory/components';
import { useUpdateCurrentUser } from '../../../profile/hooks';
import { ONBOARDING_STEPS } from '../../constants/onboardingSteps';
import type { OnboardingFlow } from '../../hooks/useOnboardingFlow';
import { OnboardingStepLayout } from '../OnboardingStepLayout';

export interface WaterStepProps {
  readonly flow: OnboardingFlow;
}

/**
 * Which water, and why it is being asked.
 *
 * Water is most of the cup, so the explanation is on the screen rather than
 * behind an info icon: an unexplained question about tap water reads as
 * data collection, and gets answered carelessly.
 */
export const WaterStep = ({ flow }: WaterStepProps): JSX.Element => {
  const { t } = useTranslation();
  const { data: user } = useCurrentUser();
  const update = useUpdateCurrentUser();

  return (
    <OnboardingStepLayout step={ONBOARDING_STEPS.water} flow={flow}>
      <Text variant="headlineSmall">{t(TRANSLATION_KEYS.setupWaterTitle)}</Text>
      <Text variant="bodyMedium" tone="muted">
        {t(TRANSLATION_KEYS.setupWaterBody)}
      </Text>
      <WaterTypePicker
        selected={user?.waterType ?? WATER_TYPES.unknown}
        disabled={update.isPending}
        onSelect={(waterType: WaterType): void => {
          update.mutate({ waterType });
        }}
      />
      <Button label={t(TRANSLATION_KEYS.onboardingContinue)} onPress={flow.goNext} fullWidth />
    </OnboardingStepLayout>
  );
};
