import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type WaterTypePickerStyleMap = ViewStyles<'wrapper'>;

export const createWaterTypePickerStyles = (theme: Theme): WaterTypePickerStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.sm, alignSelf: 'stretch' },
  });
