import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type GrinderListItemStyleMap = ViewStyles<'divided' | 'notes' | 'precision'>;

/**
 * One entry, on the sheet of entries rather than on the screen.
 *
 * The row is transparent, because the sheet under it is what carries the
 * surface - a `ListItem` is drawn on whatever it sits on, and a row that
 * painted itself would print a white block into the sheet's rounded corner.
 * The rule between entries is the in-card role for the same reason: it is
 * separating two rows of one thing, not two things - and the last row draws
 * none, because there is nothing under it to separate from.
 */
export const createGrinderListItemStyles = (theme: Theme): GrinderListItemStyleMap =>
  StyleSheet.create({
    divided: {
      borderBottomWidth: theme.borderWidth.thin,
      borderBottomColor: theme.colors.divider,
    },
    notes: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.sm,
      gap: theme.spacing.sm,
    },
    /** The glyph and its words are one statement, so they sit tighter. */
    precision: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
  });
