import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type TimelineEntryStyleMap = ViewStyles<
  | 'entry'
  | 'rail'
  | 'node'
  | 'nodeLatest'
  | 'line'
  | 'card'
  | 'cardLatest'
  | 'header'
  | 'title'
  | 'chip'
  | 'chipLatest'
  | 'note'
  | 'noteText'
  | 'constrained'
  | 'counts'
  | 'count'
>;

/**
 * One version of a recipe, hung off a rail.
 *
 * The rail is what makes this a story rather than a list: the numbers, what
 * was said about the cup, and then the version that came of it, connected so
 * the eye follows them downwards. A column of separate cards carries the same
 * rows and none of the argument, which is the whole reason this screen exists
 * apart from the cupboard.
 *
 * The node carries the version's number rather than a dot. The question this
 * screen answers is asked about a particular version, and counting dots down a
 * column to find the third one is not how anybody reads.
 *
 * The newest version is the dark node and the deeper shadow. It is where the
 * recipe currently stands, which is what somebody arriving here is looking
 * for - the rest is how it got there.
 */
export const createTimelineEntryStyles = (theme: Theme): TimelineEntryStyleMap =>
  StyleSheet.create({
    entry: { flexDirection: 'row', gap: theme.spacing.lg },
    rail: {
      width: theme.size.timelineNodeSize,
      alignItems: 'center',
      flexGrow: 0,
      flexShrink: 0,
    },
    node: {
      width: theme.size.timelineNodeSize,
      height: theme.size.timelineNodeSize,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.card,
    },
    nodeLatest: {
      backgroundColor: theme.colors.espresso,
      ...theme.elevation.buttonDark,
    },
    /** Only between two versions: a rail past the last one leads nowhere. */
    line: {
      flex: 1,
      width: theme.size.timelineRailWidth,
      marginTop: theme.spacing.xs,
      backgroundColor: theme.colors.outlineFaint,
    },
    card: {
      flex: 1,
      minWidth: 0,
      gap: theme.spacing.lg,
      padding: theme.spacing.lg,
      borderRadius: theme.shape.softCard,
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.card,
    },
    cardLatest: { ...theme.elevation.cardEmphasis },
    header: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    title: { flex: 1, minWidth: 0 },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xxs,
      height: theme.size.attributeChipHeight,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.surfaceVariant,
    },
    chipLatest: { backgroundColor: theme.colors.freshContainer },
    /**
     * What the person wrote, in a block of its own.
     *
     * Set off rather than quoted inline, because the card around it is the app
     * talking and this is the one line on it that is not.
     */
    note: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
      borderRadius: theme.shape.listItem,
      backgroundColor: theme.colors.surfaceVariant,
    },
    noteText: { flex: 1, minWidth: 0 },
    constrained: { gap: theme.spacing.sm },
    counts: { flexDirection: 'row', gap: theme.spacing.lg },
    count: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
  });
