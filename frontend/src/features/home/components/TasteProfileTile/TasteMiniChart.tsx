import { TASTE_AXIS_MAX, type TasteAxes } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { readTasteAxes, type TasteAxisValue } from '../../../tasteProfile/services';

import { barWeight, createTasteMiniChartStyles } from './TasteMiniChart.styles';

export interface TasteMiniChartProps {
  readonly axes: TasteAxes;
}

/**
 * The profile as a shape rather than as a reading.
 *
 * The same five axes, in the same fixed order, against the same full scale as
 * the labelled chart - so the two are recognisably one picture - but with no
 * numbers and no labels beside them. At this size a figure would be read as a
 * measurement, and what is worth saying at a glance is which way the profile
 * leans. The tile leads to the labelled chart for anybody who wants the rest.
 */
export const TasteMiniChart = ({ axes }: TasteMiniChartProps): JSX.Element => {
  const styles = useThemedStyles(createTasteMiniChartStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.chart} accessibilityLabel={t(TRANSLATION_KEYS.homeTileTasteChartLabel)}>
      {readTasteAxes(axes).map(({ axis, value }: TasteAxisValue): JSX.Element => (
        <View key={axis} style={styles.track}>
          <View style={[styles.fill, barWeight(value)]} />
          <View style={barWeight(TASTE_AXIS_MAX - value)} />
        </View>
      ))}
    </View>
  );
};
