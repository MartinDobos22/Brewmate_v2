import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type InventorySummaryStripStyleMap = ViewStyles<'strip' | 'cell' | 'value'>;

/**
 * Three numbers across the top of the cupboard.
 *
 * A row rather than three cards: these are one fact about the shelf read at a
 * glance, and giving each its own surface would turn the answer into three
 * questions.
 */
export const createInventorySummaryStripStyles = (theme: Theme): InventorySummaryStripStyleMap =>
  StyleSheet.create({
    strip: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.md },
    cell: { flexGrow: 1, flexBasis: 0, gap: theme.spacing.xxs },
    value: { flexDirection: 'row', alignItems: 'baseline', gap: theme.spacing.xxs },
  });
