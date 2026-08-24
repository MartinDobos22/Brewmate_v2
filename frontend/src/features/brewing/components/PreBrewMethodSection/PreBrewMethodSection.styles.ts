import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type PreBrewMethodSectionStyleMap = ViewStyles<'chips' | 'empty'>;

export const createPreBrewMethodSectionStyles = (theme: Theme): PreBrewMethodSectionStyleMap =>
  StyleSheet.create({
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    empty: { gap: theme.spacing.md, marginTop: theme.spacing.sm },
  });
