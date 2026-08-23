import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type EquipmentSetSwitcherStyleMap = ViewStyles<'wrapper' | 'row'>;

export const createEquipmentSetSwitcherStyles = (theme: Theme): EquipmentSetSwitcherStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.sm, alignSelf: 'stretch' },
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  });
