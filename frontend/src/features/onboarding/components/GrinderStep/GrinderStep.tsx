import type { JSX } from 'react';
import { View } from 'react-native';

import { Button, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { EquipmentSummaryList, GrinderPicker } from '../../../inventory/components';
import { useGrinderInventory } from '../../../inventory/hooks';
import { ONBOARDING_STEPS } from '../../constants/onboardingSteps';
import type { OnboardingFlow } from '../../hooks/useOnboardingFlow';
import { OnboardingStepLayout } from '../OnboardingStepLayout';

import { createGrinderStepStyles } from './GrinderStep.styles';

export interface GrinderStepProps {
  readonly flow: OnboardingFlow;
}

const NOTHING = 0;

/**
 * Which grinder, out of the shared catalogue - or a contributed one.
 *
 * Owning no grinder is a supported answer, not a dead end: it means the app
 * plans around pre-ground coffee and stops advising a grind setting somebody
 * has no way to change.
 */
export const GrinderStep = ({ flow }: GrinderStepProps): JSX.Element => {
  const styles = useThemedStyles(createGrinderStepStyles);
  const { t } = useTranslation();
  const inventory = useGrinderInventory();
  const hasGrinder = inventory.owned.length > NOTHING;

  return (
    <OnboardingStepLayout step={ONBOARDING_STEPS.grinder} flow={flow} scrollable={false}>
      <Text variant="headlineSmall">{t(TRANSLATION_KEYS.setupGrinderTitle)}</Text>
      <Text variant="bodyMedium" tone="muted">
        {t(TRANSLATION_KEYS.setupGrinderBody)}
      </Text>
      <EquipmentSummaryList
        items={inventory.owned}
        emptyText={t(TRANSLATION_KEYS.setupGrinderNoneNote)}
        onRemove={inventory.remove}
      />
      <View style={styles.picker}>
        <GrinderPicker onSelect={inventory.add} />
      </View>
      <Button
        label={t(
          hasGrinder
            ? TRANSLATION_KEYS.onboardingContinue
            : TRANSLATION_KEYS.setupGrinderNoneAction,
        )}
        variant={hasGrinder ? 'primary' : 'secondary'}
        onPress={flow.goNext}
        fullWidth
      />
    </OnboardingStepLayout>
  );
};
