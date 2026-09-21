import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type RecipePatchCardStyleMap = ViewStyles<
  'card' | 'heading' | 'title' | 'rows' | 'row' | 'label' | 'divider'
>;

/**
 * The proposal, as a list of things that move.
 *
 * A diff rather than a second recipe card, because the question in front of
 * somebody is not "is this a good recipe" - they have already agreed it might
 * be - it is "what exactly are you changing". A row answers that in a glance;
 * a whole recipe would make them compare two cards line by line.
 *
 * The old value is struck through and set smaller than the one replacing it,
 * so the eye lands on what the numbers become. They are separated by an arrow
 * rather than by a column rule: a table of before and after invites reading
 * down each column, and nobody wants the column of numbers that no longer
 * apply.
 *
 * The card carries depth instead of a border, like everything else the
 * redesign draws on a warm ground, and its own surface rather than the
 * assistant bubble's - it belongs to the message above it but is not something
 * anybody said.
 */
export const createRecipePatchCardStyles = (theme: Theme): RecipePatchCardStyleMap =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.shape.softCard,
      padding: theme.spacing.lgPlus,
      gap: theme.spacing.md,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.cardEmphasis,
    },
    heading: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    title: { flex: 1, minWidth: 0 },
    rows: { gap: theme.spacing.xxs },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
    },
    /** The label takes what the values leave, so a long one wraps before they do. */
    label: { flex: 1, minWidth: 0 },
    divider: { height: theme.borderWidth.thin, backgroundColor: theme.colors.divider },
  });
