import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BagRemainingBarStyleMap = ViewStyles<'wrapper' | 'header'>;

export const createBagRemainingBarStyles = (theme: Theme): BagRemainingBarStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.xs },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  });
