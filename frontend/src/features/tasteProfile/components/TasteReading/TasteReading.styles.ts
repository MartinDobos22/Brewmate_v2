import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type TasteReadingStyleMap = ViewStyles<'card' | 'row' | 'name' | 'divider'>;

/**
 * The web, said out loud - one row per axis, in one card.
 *
 * Each row repeats the mark its vertex on the chart carries. That repetition
 * is the point: it is what makes the picture and the sentences read as two
 * views of one dataset rather than as two things the reader has to line up.
 *
 * The divider is inset past the glyph, so the marks form a column of their own
 * and the rows read as a list rather than as five stacked cards.
 */
export const createTasteReadingStyles = (theme: Theme): TasteReadingStyleMap =>
  StyleSheet.create({
    card: {
      borderRadius: theme.shape.softCard,
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
      shadowColor: theme.colors.espresso,
      ...theme.elevation.card,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lgPlus,
    },
    name: { flex: 1, minWidth: 0 },
    divider: {
      height: theme.borderWidth.thin,
      marginLeft: theme.size.axisRowDividerInset,
      backgroundColor: theme.colors.divider,
    },
  });
