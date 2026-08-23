import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type StateStyleMap = ViewStyles<'wrapper' | 'text' | 'actions'>;

/** Shared layout for the three placeholder states: empty, loading and error. */
export const createEmptyStateStyles = (theme: Theme): StateStyleMap =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.md,
      padding: theme.layout.screenEdge,
    },
    text: { gap: theme.spacing.xs, alignSelf: 'stretch' },
    actions: { alignSelf: 'stretch', gap: theme.spacing.sm },
  });
