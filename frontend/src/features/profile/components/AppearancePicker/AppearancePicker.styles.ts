import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type AppearancePickerStyleMap = ViewStyles<'row'>;

export const createAppearancePickerStyles = (theme: Theme): AppearancePickerStyleMap =>
  StyleSheet.create({
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  });
