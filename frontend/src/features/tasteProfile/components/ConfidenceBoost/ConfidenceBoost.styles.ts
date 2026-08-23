import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ConfidenceBoostStyleMap = ViewStyles<'wrapper' | 'points'>;

export const createConfidenceBoostStyles = (theme: Theme): ConfidenceBoostStyleMap =>
  StyleSheet.create({
    wrapper: { alignSelf: 'stretch', gap: theme.spacing.sm },
    points: { gap: theme.spacing.xxs },
  });
