import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type TasteProfileSectionStyleMap = ViewStyles<'row'>;

export const createTasteProfileSectionStyles = (theme: Theme): TasteProfileSectionStyleMap =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: theme.spacing.sm,
    },
  });
