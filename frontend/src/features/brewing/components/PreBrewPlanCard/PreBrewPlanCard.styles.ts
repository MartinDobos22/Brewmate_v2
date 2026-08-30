import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type PreBrewPlanCardStyleMap = ViewStyles<'rows' | 'row'>;

export const createPreBrewPlanCardStyles = (theme: Theme): PreBrewPlanCardStyleMap =>
  StyleSheet.create({
    rows: { gap: theme.spacing.xs, marginBottom: theme.spacing.sm },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: theme.spacing.md,
    },
  });
