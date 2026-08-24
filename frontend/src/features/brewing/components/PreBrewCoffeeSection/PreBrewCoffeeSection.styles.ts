import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type PreBrewCoffeeSectionStyleMap = ViewStyles<'chips' | 'freeText'>;

export const createPreBrewCoffeeSectionStyles = (theme: Theme): PreBrewCoffeeSectionStyleMap =>
  StyleSheet.create({
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    freeText: { gap: theme.spacing.sm, marginTop: theme.spacing.md },
  });
