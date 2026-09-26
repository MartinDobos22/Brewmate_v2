import type { JSX } from 'react';
import { View } from 'react-native';

import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';

import { createBrewSparklineStyles, dayWeight } from './BrewSparkline.styles';

const NOTHING = 0;
const SHORTEST_SCALE = 1;
const KEY_PREFIX = 'day-';

export interface BrewSparklineProps {
  /** One count per day, oldest first, ending with today. */
  readonly days: readonly number[];
}

/**
 * A week of brewing, one bar per day.
 *
 * Scaled to the busiest day of that week rather than to a fixed ceiling: what
 * this says is which days had coffee in them and which did not, and a chart
 * scaled to somebody else's habit would draw an ordinary week as a flat line.
 */
export const BrewSparkline = ({ days }: BrewSparklineProps): JSX.Element => {
  const styles = useThemedStyles(createBrewSparklineStyles);
  const { t } = useTranslation();
  const busiest = Math.max(SHORTEST_SCALE, ...days);

  return (
    <View style={styles.chart} accessibilityLabel={t(TRANSLATION_KEYS.homeTileStatsWeekLabel)}>
      {days.map((count: number, index: number): JSX.Element => (
        <View key={`${KEY_PREFIX}${String(index)}`} style={styles.column}>
          <View style={dayWeight(busiest - count)} />
          <View style={[styles.bar, count === NOTHING && styles.barEmpty, dayWeight(count)]} />
        </View>
      ))}
    </View>
  );
};
