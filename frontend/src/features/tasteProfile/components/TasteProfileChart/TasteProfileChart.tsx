import { TASTE_AXIS_MAX, type TasteAxes } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { formatDecimal } from '../../../../lib/formatters';
import { useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { TASTE_AXIS_LABEL_KEYS } from '../../constants';
import { readTasteAxes, type TasteAxisValue } from '../../services';

import { barShare, createTasteProfileChartStyles } from './TasteProfileChart.styles';

export interface TasteProfileChartProps {
  readonly axes: TasteAxes;
}

/**
 * The profile as five bars.
 *
 * Always the same five, always in the same order, always against the full
 * scale - so a profile that has barely moved off neutral looks like one, and
 * nobody mistakes a flat chart for a considered opinion.
 */
export const TasteProfileChart = ({ axes }: TasteProfileChartProps): JSX.Element => {
  const styles = useThemedStyles(createTasteProfileChartStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      {readTasteAxes(axes).map(({ axis, value }: TasteAxisValue): JSX.Element => (
        <View key={axis} style={styles.row}>
          <View style={styles.header}>
            <Text variant="labelMedium" tone="muted">
              {t(TASTE_AXIS_LABEL_KEYS[axis])}
            </Text>
            <Text variant="numericSmall" numeric>
              {formatDecimal(value)}
            </Text>
          </View>
          <View
            style={styles.track}
            accessibilityRole="progressbar"
            accessibilityLabel={t(TASTE_AXIS_LABEL_KEYS[axis])}
            accessibilityValue={{ min: 0, max: TASTE_AXIS_MAX, now: value }}
          >
            <View style={[styles.fill, barShare(value)]} />
            <View style={barShare(TASTE_AXIS_MAX - value)} />
          </View>
        </View>
      ))}
    </View>
  );
};
