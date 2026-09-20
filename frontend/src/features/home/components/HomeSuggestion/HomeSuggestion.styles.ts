import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type HomeSuggestionStyleMap = ViewStyles<
  'block' | 'subject' | 'meta' | 'dot' | 'figures' | 'figure' | 'rule' | 'row'
>;

/**
 * What to brew this morning, in the block at the top of the screen.
 *
 * The coffee is named first and the numbers follow, because the question
 * somebody opens this app with is "what do I make" and not "how much do I
 * weigh out" - the second only matters once the first is answered.
 *
 * The figures are separated by hairlines rather than by space: they are one
 * statement read left to right, this much coffee into this much water, and
 * gaps alone would let three unrelated numbers sit in a row.
 */
export const createHomeSuggestionStyles = (theme: Theme): HomeSuggestionStyleMap =>
  StyleSheet.create({
    block: { gap: theme.spacing.lg },
    subject: { gap: theme.spacing.xs },
    meta: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    /** The bead between two facts, so neither reads as a caption of the other. */
    dot: {
      width: theme.size.metaDotSize,
      height: theme.size.metaDotSize,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.primary,
    },
    figures: { flexDirection: 'row', alignItems: 'flex-end' },
    figure: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
    rule: {
      width: theme.borderWidth.thin,
      height: theme.size.headerRuleHeight,
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
      backgroundColor: theme.colors.espressoLine,
    },
    row: { flexDirection: 'row', gap: theme.spacing.md },
  });
