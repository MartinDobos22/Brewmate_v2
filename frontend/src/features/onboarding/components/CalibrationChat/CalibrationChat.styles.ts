import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type CalibrationChatStyleMap = ViewStyles<'wrapper' | 'readings'>;

export const createCalibrationChatStyles = (theme: Theme): CalibrationChatStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.md, alignSelf: 'stretch' },
    readings: { gap: theme.spacing.xs },
  });
