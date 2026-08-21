import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type AuthScreenLayoutStyleMap = ViewStyles<'header' | 'body'>;

export const createAuthScreenLayoutStyles = (theme: Theme): AuthScreenLayoutStyleMap =>
  StyleSheet.create({
    header: { gap: theme.spacing.xs, paddingTop: theme.spacing.xl },
    body: { gap: theme.layout.cardGap },
  });
