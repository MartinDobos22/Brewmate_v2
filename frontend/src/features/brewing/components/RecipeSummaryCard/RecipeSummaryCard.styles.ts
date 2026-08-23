import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type RecipeSummaryCardStyleMap = ViewStyles<'values' | 'notes'>;

export const createRecipeSummaryCardStyles = (theme: Theme): RecipeSummaryCardStyleMap =>
  StyleSheet.create({
    values: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xl },
    notes: { gap: theme.spacing.xs, marginTop: theme.spacing.md },
  });
