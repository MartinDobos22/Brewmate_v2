import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type TasteAxisSlidersStyleMap = ViewStyles<'wrapper'>;

export const createTasteAxisSlidersStyles = (theme: Theme): TasteAxisSlidersStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.lg, alignSelf: 'stretch' },
  });
