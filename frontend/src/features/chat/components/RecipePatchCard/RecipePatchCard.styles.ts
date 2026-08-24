import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type RecipePatchCardStyleMap = ViewStyles<'rows' | 'row' | 'values'>;

export const createRecipePatchCardStyles = (theme: Theme): RecipePatchCardStyleMap =>
  StyleSheet.create({
    rows: { gap: theme.spacing.sm, marginVertical: theme.spacing.md },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },
    values: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  });
