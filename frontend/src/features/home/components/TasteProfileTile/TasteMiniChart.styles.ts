import { StyleSheet, type ViewStyle } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type TasteMiniChartStyleMap = ViewStyles<'chart' | 'track' | 'fill'>;

/**
 * The same construction as the labelled profile chart, at a smaller size.
 *
 * Deliberately the same: somebody who has seen their profile on the profile
 * screen should recognise this as the same picture rather than as a second
 * opinion about them drawn a different way.
 */
export const createTasteMiniChartStyles = (theme: Theme): TasteMiniChartStyleMap =>
  StyleSheet.create({
    chart: { gap: theme.spacing.xs, alignSelf: 'stretch' },
    track: {
      flexDirection: 'row',
      height: theme.size.tileTrackHeight,
      borderRadius: theme.radius.xs,
      backgroundColor: theme.colors.surfaceContainerHigh,
      overflow: 'hidden',
    },
    fill: { backgroundColor: theme.colors.primary },
  });

/**
 * A bar's share of its track, as a flex weight rather than a measured width.
 *
 * The same trick the full profile chart uses, and for the same reason: the
 * chart never needs to know how wide it is, so it is correct on its first
 * frame instead of growing in from nothing - which would read as a profile
 * being computed while somebody watches.
 */
export const barWeight = (weight: number): ViewStyle => ({ flexGrow: weight, flexBasis: 0 });
