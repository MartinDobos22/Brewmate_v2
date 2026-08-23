import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type GettingStartedCardStyleMap = ViewStyles<'header' | 'progress'>;

export const createGettingStartedCardStyles = (theme: Theme): GettingStartedCardStyleMap =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
    },
    progress: { gap: theme.spacing.xs, marginBottom: theme.spacing.sm },
  });
