import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type DesignSystemScreenStyleMap = ViewStyles<'root' | 'columns'>;

export const createDesignSystemScreenStyles = (theme: Theme): DesignSystemScreenStyleMap =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.colors.background },
    columns: { flexDirection: 'row' },
  });
