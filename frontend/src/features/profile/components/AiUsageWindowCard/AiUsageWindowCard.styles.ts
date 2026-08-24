import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type AiUsageWindowStyleMap = ViewStyles<'row' | 'bar' | 'body'>;

export const createAiUsageWindowStyles = (theme: Theme): AiUsageWindowStyleMap =>
  StyleSheet.create({
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
    bar: { marginVertical: theme.spacing.xs },
    body: { gap: theme.spacing.xxs },
  });
