import type { TasteAxes, TasteAxisConfidence } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';
import Svg from 'react-native-svg';

import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { readTasteAxisReadings, radarFrame } from '../../services';

import { createTasteRadarChartStyles } from './TasteRadarChart.styles';
import { TasteRadarLabels } from './TasteRadarLabels';
import { TasteRadarWeb } from './TasteRadarWeb';

export interface TasteRadarChartProps {
  readonly axes: TasteAxes;
  readonly axisConfidence: TasteAxisConfidence;
  /**
   * The same web without its labels, for a home tile.
   *
   * One component rather than a miniature drawn separately: somebody who has
   * seen their profile on the profile screen has to recognise the tile as the
   * same picture rather than as a second opinion about them drawn a different
   * way, and two components would eventually differ by a ring or a stroke.
   * At tile size a label would be unreadable anyway, and what is worth saying
   * at a glance is which way the shape leans.
   */
  readonly compact?: boolean;
}

/** With no labels there is nothing to reserve room for, so the web fills the square. */
const NO_LABEL_INSET = 0;

/**
 * The profile as one shape.
 *
 * Five bars against a 0-10 scale asked the reader to do three things before
 * they learned anything: hold the scale in their head, work out where its
 * middle was, and then decide whether 7,4 was a lot. A web answers all three
 * at once - the shape leans towards what somebody wants and away from what
 * they do not, and nobody has to be told which direction is which.
 *
 * Always the same five axes, always in the same order, always against the full
 * scale, so a profile that has barely moved off the middle looks like one and
 * the same profile is recognisable a month later.
 *
 * What is drawn and what is known are separate questions, and the chart
 * answers both. A polygon cannot have a hole in it, so an axis nobody has said
 * anything about is still drawn - at the middle, where the profile stores it -
 * and marked as an outline with its name muted. The reading underneath says
 * the same thing in words.
 */
export const TasteRadarChart = ({
  axes,
  axisConfidence,
  compact = false,
}: TasteRadarChartProps): JSX.Element => {
  const styles = useThemedStyles(createTasteRadarChartStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const readings = readTasteAxisReadings(axes, axisConfidence);
  const size = compact ? theme.size.radarChartCompactSize : theme.size.radarChartSize;
  const frame = radarFrame(
    size,
    compact ? NO_LABEL_INSET : theme.size.radarChartLabelInset,
    readings.length,
  );

  return (
    <View style={styles.wrapper}>
      <View
        style={compact ? styles.compactSquare : styles.square}
        accessibilityRole="image"
        accessibilityLabel={t(TRANSLATION_KEYS.profileTasteChartLabel)}
      >
        <Svg width={size} height={size}>
          <TasteRadarWeb frame={frame} readings={readings} theme={theme} />
        </Svg>
        {compact ? null : <TasteRadarLabels frame={frame} readings={readings} />}
      </View>
    </View>
  );
};
