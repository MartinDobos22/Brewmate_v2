import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type EquipmentSectionStyleMap = ViewStyles<'actions'>;

export const createEquipmentSectionStyles = (theme: Theme): EquipmentSectionStyleMap =>
  StyleSheet.create({
    actions: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  });
