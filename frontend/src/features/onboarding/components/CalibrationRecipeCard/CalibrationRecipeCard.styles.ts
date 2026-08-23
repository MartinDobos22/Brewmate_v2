import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type CalibrationRecipeCardStyleMap = ViewStyles<'values' | 'notes'>;

export const createCalibrationRecipeCardStyles = (theme: Theme): CalibrationRecipeCardStyleMap =>
  StyleSheet.create({
    values: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xl },
    notes: { gap: theme.spacing.xs, marginTop: theme.spacing.md },
  });
