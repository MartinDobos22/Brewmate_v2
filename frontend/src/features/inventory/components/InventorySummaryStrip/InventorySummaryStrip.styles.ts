import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type InventorySummaryStripStyleMap = ViewStyles<'strip' | 'cell' | 'rule'>;

/**
 * Three figures across the top of the cupboard, on the screen's own ground.
 *
 * A row rather than three cards, and no card around it either: these are one
 * fact about the shelf read at a glance, and giving each a surface would turn
 * one answer into three questions. What separates them is a hairline, which is
 * the least a divider can be and still be one.
 */
export const createInventorySummaryStripStyles = (theme: Theme): InventorySummaryStripStyleMap =>
  StyleSheet.create({
    strip: { flexDirection: 'row', alignItems: 'flex-end' },
    cell: { flexGrow: 1, flexBasis: 0, gap: theme.spacing.xxs },
    rule: {
      width: theme.borderWidth.thin,
      height: theme.size.summaryRuleHeight,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.xs,
      backgroundColor: theme.colors.outlineFaint,
    },
  });
