import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type InventoryTileStyleMap = ViewStyles<'amount'>;

export const createInventoryTileStyles = (theme: Theme): InventoryTileStyleMap =>
  StyleSheet.create({
    amount: { flexDirection: 'row', alignItems: 'baseline', gap: theme.spacing.xxs },
  });
