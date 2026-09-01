import { StyleSheet, type ViewStyle } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';
import { RADAR_GEOMETRY } from '../../constants';
import type { RadarPoint } from '../../services';
/** The label layer covers the drawn square exactly, and adds nothing to it. */
const EDGE = 0;

type TasteRadarChartStyleMap = ViewStyles<'wrapper' | 'square' | 'compactSquare'>;
type TasteRadarLabelsStyleMap = ViewStyles<'layer' | 'label'>;

export const createTasteRadarChartStyles = (theme: Theme): TasteRadarChartStyleMap =>
  StyleSheet.create({
    wrapper: { alignItems: 'center', alignSelf: 'stretch' },
    square: {
      width: theme.size.radarChartSize,
      height: theme.size.radarChartSize,
    },
    compactSquare: {
      width: theme.size.radarChartCompactSize,
      height: theme.size.radarChartCompactSize,
    },
  });

export const createTasteRadarLabelsStyles = (theme: Theme): TasteRadarLabelsStyleMap =>
  StyleSheet.create({
    layer: { position: 'absolute', top: EDGE, left: EDGE, right: EDGE, bottom: EDGE },
    label: {
      position: 'absolute',
      width: theme.size.radarLabelWidth,
      marginLeft: -theme.size.radarLabelWidth / RADAR_GEOMETRY.half,
    },
  });

/**
 * Where one label sits, built from the same polar arithmetic as the vertex it
 * belongs to.
 *
 * A named function in the styles file rather than an object written into the
 * JSX: this is geometry that only exists at runtime, which is the one thing a
 * stylesheet cannot hold, and the rule about styles never being written inside
 * a component holds for it too.
 */
export const labelPosition = ({ x, y }: RadarPoint): ViewStyle => ({ left: x, top: y });
