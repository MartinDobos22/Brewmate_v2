import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type EquipmentSummaryListStyleMap = ViewStyles<'wrapper'>;

export const createEquipmentSummaryListStyles = (theme: Theme): EquipmentSummaryListStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.xs, alignSelf: 'stretch' },
  });
