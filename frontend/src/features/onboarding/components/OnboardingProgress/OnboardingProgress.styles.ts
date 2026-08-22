import { StyleSheet, type ViewStyle } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type OnboardingProgressStyleMap = ViewStyles<'wrapper' | 'track' | 'fill'>;

export const createOnboardingProgressStyles = (theme: Theme): OnboardingProgressStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.xs, alignSelf: 'stretch' },
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
