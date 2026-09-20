import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type HomeHintCardStyleMap = ViewStyles<'card' | 'body' | 'pressed'>;

/**
 * The one thing the home screen has to say today.
 *
 * Painted in the fresh container rather than on the surface, because it is the
 * only thing on this screen that is worth reading rather than tapping - and a
 * white card among white cards would read as another report. Two lines: what
 * is true, then what to do about it.
 */
export const createHomeHintCardStyles = (theme: Theme): HomeHintCardStyleMap =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.shape.softCard,
      backgroundColor: theme.colors.freshContainer,
    },
    body: { flex: 1, minWidth: 0, gap: theme.spacing.xs },
    pressed: { opacity: theme.opacity.pressed },
  });
