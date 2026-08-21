import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type SchemePickerStyleMap = ViewStyles<'row'>;

export const createSchemePickerStyles = (theme: Theme): SchemePickerStyleMap =>
  StyleSheet.create({
    row: { flexDirection: 'row', gap: theme.spacing.sm, padding: theme.layout.screenEdge },
  });
