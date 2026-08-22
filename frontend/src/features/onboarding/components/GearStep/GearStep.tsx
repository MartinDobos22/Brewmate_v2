import { EQUIPMENT_TYPES, readKettleParams } from '@brewmate/shared';
import type { JSX } from 'react';

import { Button, OptionCard, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useEquipmentToggle } from '../../../inventory/hooks';
import { ONBOARDING_STEPS } from '../../constants/onboardingSteps';
import type { OnboardingFlow } from '../../hooks/useOnboardingFlow';
import { OnboardingStepLayout } from '../OnboardingStepLayout';

export interface GearStepProps {
  readonly flow: OnboardingFlow;
}

const HAS_CONTROL = { hasTemperatureControl: true };
const NO_CONTROL = { hasTemperatureControl: false };
const NO_PARAMS = {};

/**
 * The scale and the kettle.
 *
 * Both answers are recorded as they are, including "nemám": a cup brewed by
 * eye without temperature control says less about somebody's taste than one
 * brewed to the gram, and the API prices exactly that difference.
 */
export const GearStep = ({ flow }: GearStepProps): JSX.Element => {
  const { t } = useTranslation();
  const scale = useEquipmentToggle(EQUIPMENT_TYPES.scale);
  const kettle = useEquipmentToggle(EQUIPMENT_TYPES.kettle);
  const kettleControl =
    kettle.item === undefined ? undefined : readKettleParams(kettle.item.params);

  return (
    <OnboardingStepLayout step={ONBOARDING_STEPS.gear} flow={flow}>
      <Text variant="headlineSmall">{t(TRANSLATION_KEYS.setupGearTitle)}</Text>
      <Text variant="bodyMedium" tone="muted">
        {t(TRANSLATION_KEYS.setupGearBody)}
      </Text>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.setupGearScaleQuestion)}</Text>
      <OptionCard
        label={t(TRANSLATION_KEYS.setupGearScaleYes)}
        selected={scale.item !== undefined}
        disabled={scale.isPending}
        onPress={(): void => {
          scale.setPresent(NO_PARAMS);
        }}
      />
      <OptionCard
        label={t(TRANSLATION_KEYS.setupGearScaleNo)}
        note={t(TRANSLATION_KEYS.setupGearScaleNote)}
        disabled={scale.isPending}
        onPress={scale.setAbsent}
      />
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.setupGearKettleQuestion)}</Text>
      <OptionCard
        label={t(TRANSLATION_KEYS.setupGearKettleYes)}
        selected={kettleControl?.hasTemperatureControl === true}
        disabled={kettle.isPending}
        onPress={(): void => {
          kettle.setPresent(HAS_CONTROL);
        }}
      />
      <OptionCard
        label={t(TRANSLATION_KEYS.setupGearKettleNo)}
        note={t(TRANSLATION_KEYS.setupGearKettleNote)}
        selected={kettleControl?.hasTemperatureControl === false}
        disabled={kettle.isPending}
        onPress={(): void => {
          kettle.setPresent(NO_CONTROL);
        }}
      />
      <Button label={t(TRANSLATION_KEYS.onboardingContinue)} onPress={flow.goNext} fullWidth />
    </OnboardingStepLayout>
  );
};
