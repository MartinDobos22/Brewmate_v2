import { StyleSheet, type ViewStyle } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type InsightsCardStyleMap = ViewStyles<
  | 'stack'
  | 'card'
  | 'heading'
  | 'rows'
  | 'row'
  | 'name'
  | 'track'
  | 'fill'
  | 'lead'
  | 'rest'
  | 'count'
  | 'note'
  | 'empty'
>;

/**
 * What a stretch of brewing adds up to, as one card per question.
 *
 * Three cards rather than one with three headings, because the reader asks
 * three separate things of it - where my coffee comes from, what was done to
 * it, how it was roasted - and a single card invites them to be read as one
 * ranking.
 *
 * Every row carries a bar as well as a figure. The figure is the fact; the bar
 * is what makes "9" and "16" different at a glance without anybody doing
 * arithmetic on the way down the screen.
 */
export const createInsightsCardStyles = (theme: Theme): InsightsCardStyleMap =>
  StyleSheet.create({
    stack: { gap: theme.spacing.md },
    card: {
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.shape.softCard,
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.card,
    },
    heading: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    rows: { gap: theme.spacing.sm },
    row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
    /** Fixed, so the bars start in one column however long the words are. */
    name: { width: theme.size.insightNameWidth },
    track: {
      flex: 1,
      minWidth: 0,
      flexDirection: 'row',
      height: theme.size.measureBarHeight,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.surfaceDim,
      overflow: 'hidden',
    },
    fill: { height: '100%', borderRadius: theme.shape.pill },
    /**
     * The most-brewed value in its section is the darker shade and the rest
     * the lighter one. Rank rather than size, so the top row of every card is
     * findable at a glance - the bar already says how much bigger it is.
     */
    lead: { backgroundColor: theme.colors.primary },
    rest: { backgroundColor: theme.colors.roastMid },
    count: { width: theme.size.insightCountWidth, alignItems: 'flex-end' },
    /**
     * The sentence that keeps a list of counts from reading as a ranking of
     * somebody's taste. Under the numbers rather than above them, so it is
     * read as the answer to the question the numbers raise.
     */
    note: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
    },
    empty: {
      gap: theme.spacing.xs,
      padding: theme.spacing.lg,
      borderRadius: theme.shape.softCard,
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.card,
    },
  });

/**
 * A share of the track, as a flex weight rather than a measured width.
 *
 * Weights rather than percentages so the row is correct on its first frame
 * instead of waiting to be told how wide the card is - the same reason the
 * home screen's tiles and the week's sparkline are built this way. The bar is
 * drawn as a fill and the gap after it, both weighted, because a single
 * percentage cannot be animated or rounded consistently across two cards.
 */
export const insightBarShare = (weight: number): ViewStyle => ({
  flexGrow: weight,
  flexBasis: 0,
});
