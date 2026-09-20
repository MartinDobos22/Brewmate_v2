import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text, type TextTone } from '../../../../components/ui';
import { useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import {
  DEFAULT_RADAR_GROUND,
  RADAR_CHART,
  TASTE_AXIS_ICONS,
  TASTE_AXIS_LABEL_KEYS,
  type RadarGround,
} from '../../constants';
import { radarPoint, type RadarFrame, type TasteAxisReading } from '../../services';

import { createTasteRadarLabelsStyles, labelPosition } from './TasteRadarChart.styles';

const KNOWN_TONES = {
  surface: 'default',
  espresso: 'onEspresso',
} as const satisfies Record<RadarGround, TextTone>;

const UNKNOWN_TONES = {
  surface: 'muted',
  espresso: 'onEspressoMuted',
} as const satisfies Record<RadarGround, TextTone>;

export interface TasteRadarLabelsProps {
  readonly frame: RadarFrame;
  readonly readings: readonly TasteAxisReading[];
  readonly ground?: RadarGround;
}

/**
 * The five axis names, sitting just outside the web, each with its own mark.
 *
 * Ordinary text rather than SVG text, and absolutely positioned onto the same
 * polar arithmetic the vertices use. SVG has its own font handling and its own
 * idea of what a label is, and using it here would mean five pieces of the
 * interface that ignore the type scale, ignore the theme and are invisible to
 * every lint rule that keeps Slovak copy out of the components.
 *
 * The glyph is the same one the row underneath the chart carries, which is
 * what makes the picture and the sentences read as two views of one dataset.
 * An axis the profile has heard nothing about is muted, so the name, the mark
 * and the hollow vertex it belongs to all say the same thing.
 */
export const TasteRadarLabels = ({
  frame,
  readings,
  ground = DEFAULT_RADAR_GROUND,
}: TasteRadarLabelsProps): JSX.Element => {
  const styles = useThemedStyles(createTasteRadarLabelsStyles);
  const theme = useTheme();
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
          <MaterialCommunityIcons
            name={TASTE_AXIS_ICONS[reading.axis]}
            size={theme.size.iconTiny}
            color={
              reading.known
                ? theme.colors[ground === 'espresso' ? 'accentOnEspresso' : 'onSurfaceVariant']
                : theme.colors[ground === 'espresso' ? 'onEspressoVariant' : 'onSurfaceEmpty']
            }
          />
          <Text
            variant="chipLabel"
            tone={reading.known ? KNOWN_TONES[ground] : UNKNOWN_TONES[ground]}
            align="center"
          >
            {t(TASTE_AXIS_LABEL_KEYS[reading.axis])}
          </Text>
        </View>
      ))}
    </View>
  );
};
