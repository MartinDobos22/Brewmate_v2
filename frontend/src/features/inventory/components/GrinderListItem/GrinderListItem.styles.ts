import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type GrinderListItemStyleMap = ViewStyles<'wrapper' | 'notes'>;

export const createGrinderListItemStyles = (theme: Theme): GrinderListItemStyleMap =>
  StyleSheet.create({
    wrapper: {
      borderBottomWidth: theme.borderWidth.thin,
      borderBottomColor: theme.colors.outlineVariant,
    },
    notes: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.sm,
      gap: theme.spacing.xxs,
    },
  });
