import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BrewHistoryCardStyleMap = ViewStyles<'points' | 'why'>;

export const createBrewHistoryCardStyles = (theme: Theme): BrewHistoryCardStyleMap =>
  StyleSheet.create({
    points: { gap: theme.spacing.xxs, marginBottom: theme.spacing.sm },
    why: {
      borderLeftWidth: theme.borderWidth.thick,
      borderLeftColor: theme.colors.outlineVariant,
      paddingLeft: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
  });
