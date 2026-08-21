import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type MotionTrackStyleMap = ViewStyles<'wrapper' | 'track' | 'dot'>;

export const createMotionTrackStyles = (theme: Theme): MotionTrackStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.xs },
    track: {
      height: theme.size.motionTrackHeight,
      borderRadius: theme.shape.icon,
      backgroundColor: theme.colors.surfaceContainerHigh,
      justifyContent: 'center',
    },
    dot: {
      width: theme.size.motionTrackHeight,
      height: theme.size.motionTrackHeight,
      borderRadius: theme.shape.icon,
      backgroundColor: theme.colors.primary,
    },
  });
