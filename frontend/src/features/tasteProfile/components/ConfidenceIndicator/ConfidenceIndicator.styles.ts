import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ConfidenceIndicatorStyleMap = ViewStyles<'wrapper' | 'row'>;

export const createConfidenceIndicatorStyles = (theme: Theme): ConfidenceIndicatorStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.xs, alignSelf: 'stretch' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  });
