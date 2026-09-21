import { StyleSheet, type ViewStyle } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type ProgressBarStyleMap = ViewStyles<'track' | 'fill'>;

export const createProgressBarStyles = (theme: Theme): ProgressBarStyleMap =>
  StyleSheet.create({
    /**
     * Rounded at both ends and drawn on the dim surface rather than the high
     * container, so a bar reads as a measurement against a scale rather than
     * as a filled box. Taller than the onboarding strip, which is a count of
     * steps and not a quantity.
     */
    track: {
      flexDirection: 'row',
      height: theme.size.measureBarHeight,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.surfaceDim,
      overflow: 'hidden',
    },
    fill: { backgroundColor: theme.colors.primary },
  });

/** Share of the bar, as a flex weight - no measured width, no layout pass. */
export const progressShare = (weight: number): ViewStyle => ({ flexGrow: weight, flexBasis: 0 });
