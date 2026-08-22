import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type GrinderUseFilterStyleMap = ViewStyles<'row'>;

export const createGrinderUseFilterStyles = (theme: Theme): GrinderUseFilterStyleMap =>
  StyleSheet.create({
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  });
