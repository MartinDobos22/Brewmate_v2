import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type StateStyleMap = ViewStyles<'wrapper' | 'text' | 'actions'>;

/**
 * Shared layout for the three placeholder states: empty, loading and failed.
 *
 * One layout because they are one moment - a screen with nothing on it yet -
 * and three screens that drew that moment three ways would make the app look
 * like it was still being written. The body is held to a readable width
 * rather than running the whole phone: a centred sentence that spans 390
 * points is one the eye has to track back across.
 */
export const createEmptyStateStyles = (theme: Theme): StateStyleMap =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.lgPlus,
      padding: theme.spacing.lgPlus,
    },
    text: { gap: theme.spacing.sm, maxWidth: theme.size.emptyBodyMaxWidth },
    actions: { alignSelf: 'stretch', gap: theme.spacing.sm },
  });
