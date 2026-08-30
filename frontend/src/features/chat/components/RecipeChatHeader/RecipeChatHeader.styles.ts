import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type RecipeChatHeaderStyleMap = ViewStyles<'rows' | 'row'>;

export const createRecipeChatHeaderStyles = (theme: Theme): RecipeChatHeaderStyleMap =>
  StyleSheet.create({
    rows: { gap: theme.spacing.xs, marginTop: theme.spacing.xs },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: theme.spacing.md,
    },
  });
