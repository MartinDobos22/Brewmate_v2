import { StyleSheet, type ViewStyle } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type ProgressBarStyleMap = ViewStyles<'track' | 'fill'>;

export const createProgressBarStyles = (theme: Theme): ProgressBarStyleMap =>
  StyleSheet.create({
    track: {
      flexDirection: 'row',
      height: theme.size.progressBarHeight,
      borderRadius: theme.radius.xs,
      backgroundColor: theme.colors.surfaceContainerHigh,
      overflow: 'hidden',
    },
    fill: { backgroundColor: theme.colors.primary },
  });

/** Share of the bar, as a flex weight - no measured width, no layout pass. */
export const progressShare = (weight: number): ViewStyle => ({ flexGrow: weight, flexBasis: 0 });
