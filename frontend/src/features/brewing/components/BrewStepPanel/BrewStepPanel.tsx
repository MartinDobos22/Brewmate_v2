import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatGrams } from '../../../../lib/formatters';
import { useThemedStyles } from '../../../../theme';
import type { BrewTimelineStep } from '../../services/resolveBrewTimeline';
import { BrewStepProgress } from '../BrewStepProgress';

import { createBrewStepPanelStyles } from './BrewStepPanel.styles';

export interface BrewStepPanelProps {
  readonly current: BrewTimelineStep;
  readonly stepNumber: number;
  readonly total: number;
  readonly next: BrewTimelineStep | undefined;
}

/**
 * What to do right now, and the one thing coming after it.
 *
 * The target weight is given the same weight as the instruction, because it is
 * the instruction: on a dripper the whole of "what do I do" is a number on the
 * scale. The next step is shown small - enough to know a bloom is coming, not
 * enough to be read instead of the current one.
 */
export const BrewStepPanel = ({
  current,
  stepNumber,
  total,
  next,
}: BrewStepPanelProps): JSX.Element => {
  const styles = useThemedStyles(createBrewStepPanelStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <BrewStepProgress stepNumber={stepNumber} total={total} />
      <Text variant="labelMedium" tone="muted" align="center">
        {t(TRANSLATION_KEYS.brewModeStepOf, { current: stepNumber, total })}
      </Text>
      <Text variant="headlineLarge" align="center">
        {current.step.label}
      </Text>
      {current.step.waterGrams === null ? null : (
        <Text variant="numericHero" align="center" numeric>
          {t(TRANSLATION_KEYS.brewModeTargetWeight, {
            grams: formatGrams(current.step.waterGrams),
          })}
        </Text>
      )}
      {current.step.note === null ? null : (
        <Text variant="bodyLarge" tone="muted" align="center">
          {current.step.note}
        </Text>
      )}
      {next === undefined ? (
        <Text variant="bodySmall" tone="muted" align="center">
          {t(TRANSLATION_KEYS.brewModeLastStep)}
        </Text>
      ) : (
        <Text variant="bodySmall" tone="muted" align="center">
          {t(TRANSLATION_KEYS.brewModeNextStep, { label: next.step.label })}
        </Text>
      )}
    </View>
  );
};
