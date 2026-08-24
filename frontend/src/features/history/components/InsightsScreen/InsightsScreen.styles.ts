import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type InsightsScreenStyleMap = ViewStyles<'stack'>;

export const createInsightsScreenStyles = (theme: Theme): InsightsScreenStyleMap =>
  StyleSheet.create({
    stack: { gap: theme.spacing.md },
  });
