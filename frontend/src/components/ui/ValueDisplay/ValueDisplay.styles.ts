import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type ValueDisplayStyleMap = ViewStyles<'wrapper' | 'row'>;

export const createValueDisplayStyles = (theme: Theme): ValueDisplayStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.xxs },
    row: { flexDirection: 'row', alignItems: 'baseline', gap: theme.spacing.xs },
  });
