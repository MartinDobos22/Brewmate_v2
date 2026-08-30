import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type InsightsScreenStyleMap = ViewStyles<'stack' | 'intro'>;

export const createInsightsScreenStyles = (theme: Theme): InsightsScreenStyleMap =>
  StyleSheet.create({
    intro: { gap: theme.spacing.xxs, paddingBottom: theme.spacing.xs },
    stack: { gap: theme.spacing.md },
  });
