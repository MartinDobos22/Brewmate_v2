import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type CoffeeBagDetailStyleMap = ViewStyles<'meta' | 'rows' | 'row' | 'group' | 'recipes'>;

export const createCoffeeBagDetailStyles = (theme: Theme): CoffeeBagDetailStyleMap =>
  StyleSheet.create({
    meta: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.xs,
    },
    rows: { gap: theme.spacing.sm, marginTop: theme.spacing.md },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: theme.spacing.md,
    },
    group: { gap: theme.spacing.sm, marginTop: theme.spacing.lg },
    recipes: { gap: theme.spacing.sm },
  });
