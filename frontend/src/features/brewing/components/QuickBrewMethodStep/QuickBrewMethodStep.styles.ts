import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type QuickBrewMethodStepStyleMap = ViewStyles<'options'>;

export const createQuickBrewMethodStepStyles = (theme: Theme): QuickBrewMethodStepStyleMap =>
  StyleSheet.create({
    options: { gap: theme.spacing.sm },
  });
