import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type EquipmentSetFormStyleMap = ViewStyles<'wrapper' | 'field' | 'row'>;

export const createEquipmentSetFormStyles = (theme: Theme): EquipmentSetFormStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.lg, alignSelf: 'stretch' },
    field: { gap: theme.spacing.sm },
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  });
