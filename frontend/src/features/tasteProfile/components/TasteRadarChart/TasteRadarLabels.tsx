import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { RADAR_CHART, TASTE_AXIS_LABEL_KEYS } from '../../constants';
import { radarPoint, type RadarFrame, type TasteAxisReading } from '../../services';

import { createTasteRadarLabelsStyles, labelPosition } from './TasteRadarChart.styles';

export interface TasteRadarLabelsProps {
  readonly frame: RadarFrame;
  readonly readings: readonly TasteAxisReading[];
}

/**
 * The five axis names, sitting just outside the web.
 *
 * Ordinary text rather than SVG text, and absolutely positioned onto the same
 * polar arithmetic the vertices use. SVG has its own font handling and its own
 * idea of what a label is, and using it here would mean five pieces of the
 * interface that ignore the type scale, ignore the theme and are invisible to
 * every lint rule that keeps Slovak copy out of the components.
 *
 * An axis the profile has heard nothing about is muted, so the name and the
 * hollow vertex it belongs to say the same thing.
 */
export const TasteRadarLabels = ({ frame, readings }: TasteRadarLabelsProps): JSX.Element => {
  const styles = useThemedStyles(createTasteRadarLabelsStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.layer} pointerEvents="none">
      {readings.map((reading: TasteAxisReading, index: number): JSX.Element => (
        <View
          key={reading.axis}
          style={[
            styles.label,
            labelPosition(radarPoint(frame, index, frame.radius + RADAR_CHART.labelGap)),
          ]}
        >
          <Text variant="labelSmall" tone={reading.known ? 'default' : 'muted'} align="center">
            {t(TASTE_AXIS_LABEL_KEYS[reading.axis])}
          </Text>
        </View>
      ))}
    </View>
  );
};
