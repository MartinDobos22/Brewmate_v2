import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type TasteReadingStyleMap = ViewStyles<'wrapper' | 'row'>;

export const createTasteReadingStyles = (theme: Theme): TasteReadingStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.xs, alignSelf: 'stretch' },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: theme.spacing.sm,
    },
  });
