import { StyleSheet, type ViewStyle } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type TasteProfileChartStyleMap = ViewStyles<'wrapper' | 'row' | 'header' | 'track' | 'fill'>;

export const createTasteProfileChartStyles = (theme: Theme): TasteProfileChartStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.md, alignSelf: 'stretch' },
    row: { gap: theme.spacing.xxs },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
    track: {
      flexDirection: 'row',
      height: theme.size.profileBarHeight,
      borderRadius: theme.radius.xs,
      backgroundColor: theme.colors.surfaceContainerHigh,
      overflow: 'hidden',
    },
    fill: { backgroundColor: theme.colors.primary },
  });

/**
 * A bar's share of the track, expressed as flex weights rather than a measured
 * width: the chart never needs to know how wide it is, so it never has to wait
 * for a layout pass to draw itself correctly.
 */
export const barShare = (weight: number): ViewStyle => ({ flexGrow: weight, flexBasis: 0 });
