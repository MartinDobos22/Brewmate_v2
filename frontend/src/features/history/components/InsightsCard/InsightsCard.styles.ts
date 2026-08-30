import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type InsightsCardStyleMap = ViewStyles<'group' | 'row' | 'disclaimer'>;

export const createInsightsCardStyles = (theme: Theme): InsightsCardStyleMap =>
  StyleSheet.create({
    group: { marginTop: theme.spacing.sm, gap: theme.spacing.xxs },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
    /**
     * The sentence that keeps a list of counts from reading as a ranking of
     * somebody's taste. It sits under the numbers rather than above them, so
     * it is read as the answer to the question the numbers raise.
     */
    disclaimer: {
      marginTop: theme.spacing.md,
      borderTopWidth: theme.borderWidth.thin,
      borderTopColor: theme.colors.outlineVariant,
      paddingTop: theme.spacing.sm,
    },
  });
