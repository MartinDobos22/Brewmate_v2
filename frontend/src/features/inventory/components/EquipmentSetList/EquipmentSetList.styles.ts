import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type EquipmentSetListStyleMap = ViewStyles<'wrapper'>;

export const createEquipmentSetListStyles = (theme: Theme): EquipmentSetListStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.xs, alignSelf: 'stretch' },
  });
