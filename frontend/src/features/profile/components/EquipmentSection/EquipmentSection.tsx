import type { Equipment } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, Chip, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { EquipmentSummaryList } from '../../../inventory/components';
import { useDeleteEquipment, useEquipmentList } from '../../../inventory/hooks';
import {
  ONBOARDING_STEPS,
  ONBOARDING_STEP_LABEL_KEYS,
  ONBOARDING_PROGRESS_STEPS,
  type OnboardingProgressStep,
} from '../../../onboarding/constants';
import { useOnboardingStepLink } from '../../../onboarding/hooks';

import { createEquipmentSectionStyles } from './EquipmentSection.styles';

const NONE: readonly Equipment[] = [];

/** The three onboarding steps that write equipment, reachable one tap from here. */
const EQUIPMENT_STEPS: readonly OnboardingProgressStep[] = ONBOARDING_PROGRESS_STEPS.filter(
  (step: OnboardingProgressStep): boolean =>
    step === ONBOARDING_STEPS.grinder ||
    step === ONBOARDING_STEPS.brewers ||
    step === ONBOARDING_STEPS.gear,
);

/**
 * The cupboard, and the way back into the screens that filled it.
 *
 * Editing gear reopens the onboarding step rather than duplicating it: one
 * screen for "which grinder", used both the first time and every time after.
 */
export const EquipmentSection = (): JSX.Element => {
  const styles = useThemedStyles(createEquipmentSectionStyles);
  const { t } = useTranslation();
  const equipment = useEquipmentList();
  const remove = useDeleteEquipment();
  const openStep = useOnboardingStepLink();

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.profileEquipmentTitle)}</Text>
      <EquipmentSummaryList
        items={equipment.data?.items ?? NONE}
        emptyText={t(TRANSLATION_KEYS.profileEquipmentEmpty)}
        onRemove={(equipmentId: string): void => {
          remove.mutate(equipmentId);
        }}
      />
      <View style={styles.actions}>
        {EQUIPMENT_STEPS.map((step: OnboardingProgressStep): JSX.Element => (
          <Chip
            key={step}
            label={t(ONBOARDING_STEP_LABEL_KEYS[step])}
            onPress={(): void => {
              openStep(step);
            }}
          />
        ))}
      </View>
    </Card>
  );
};
