import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type DialInScreenStyleMap = ViewStyles<'body' | 'message' | 'finish'>;

export const createDialInScreenStyles = (theme: Theme): DialInScreenStyleMap =>
  StyleSheet.create({
    body: { gap: theme.spacing.md },
    message: { gap: theme.spacing.sm },
    finish: { gap: theme.spacing.sm, marginTop: theme.spacing.md },
  });
