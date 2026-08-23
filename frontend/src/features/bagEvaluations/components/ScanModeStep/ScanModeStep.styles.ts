import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ScanModeStepStyleMap = ViewStyles<'options'>;

export const createScanModeStepStyles = (theme: Theme): ScanModeStepStyleMap =>
  StyleSheet.create({
    options: { gap: theme.spacing.md },
  });
