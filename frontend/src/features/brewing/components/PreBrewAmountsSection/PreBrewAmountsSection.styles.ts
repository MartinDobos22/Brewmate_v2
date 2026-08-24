import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type PreBrewAmountsSectionStyleMap = ViewStyles<'steppers' | 'notes'>;

export const createPreBrewAmountsSectionStyles = (theme: Theme): PreBrewAmountsSectionStyleMap =>
  StyleSheet.create({
    steppers: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xl,
      marginVertical: theme.spacing.md,
    },
    notes: { gap: theme.spacing.xs, marginTop: theme.spacing.md },
  });
