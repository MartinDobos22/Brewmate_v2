import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type CoffeeTasteCardStyleMap = ViewStyles<'notes' | 'note'>;

export const createCoffeeTasteCardStyles = (theme: Theme): CoffeeTasteCardStyleMap =>
  StyleSheet.create({
    notes: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs },
    note: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xxs,
      borderRadius: theme.shape.chip,
      backgroundColor: theme.colors.secondaryContainer,
    },
  });
