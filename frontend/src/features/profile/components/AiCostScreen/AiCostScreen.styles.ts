import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type AiCostScreenStyleMap = ViewStyles<'stack' | 'intro'>;

export const createAiCostScreenStyles = (theme: Theme): AiCostScreenStyleMap =>
  StyleSheet.create({
    stack: { gap: theme.spacing.md },
    intro: { gap: theme.spacing.xxs, marginBottom: theme.spacing.md },
  });
