import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type CoffeeBagCardStyleMap = ViewStyles<'header' | 'meta' | 'actions'>;

export const createCoffeeBagCardStyles = (theme: Theme): CoffeeBagCardStyleMap =>
  StyleSheet.create({
    header: { gap: theme.spacing.xxs },
    meta: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    actions: { flexDirection: 'row', gap: theme.spacing.sm, marginTop: theme.spacing.sm },
  });
