import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type DialInScreenStyleMap = ViewStyles<'body' | 'state' | 'message' | 'finish'>;

export const createDialInScreenStyles = (theme: Theme): DialInScreenStyleMap =>
  StyleSheet.create({
    /** The screen's own edge, which the espresso block above it does not take. */
    body: { padding: theme.spacing.lgPlus, gap: theme.spacing.lg },
    /** Loading and failure take the screen's edge, which the block above does not. */
    state: { padding: theme.spacing.lgPlus },
    message: { gap: theme.spacing.sm },
    finish: { gap: theme.spacing.sm, marginTop: theme.spacing.md },
  });
