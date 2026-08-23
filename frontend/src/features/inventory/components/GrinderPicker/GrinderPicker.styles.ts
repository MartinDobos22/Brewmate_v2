import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type GrinderPickerStyleMap = ViewStyles<'wrapper' | 'list'>;

export const createGrinderPickerStyles = (theme: Theme): GrinderPickerStyleMap =>
  StyleSheet.create({
    wrapper: { flex: 1, gap: theme.spacing.md },
    list: { flex: 1 },
  });
