import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BrewMethodPickerStyleMap = ViewStyles<'wrapper'>;

export const createBrewMethodPickerStyles = (theme: Theme): BrewMethodPickerStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.lg, alignSelf: 'stretch' },
  });
