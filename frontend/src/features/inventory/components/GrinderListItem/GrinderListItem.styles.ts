import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type GrinderListItemStyleMap = ViewStyles<'wrapper' | 'notes'>;

/**
 * One entry, on the sheet of entries rather than on the screen.
 *
 * The row itself is transparent - a `ListItem` is drawn on whatever it sits
 * on - so the surface belongs here, where the list decides it wants to read
 * as one continuous object rather than as a column of separate cards. The
 * rule between entries is the in-card role for the same reason: it is
 * separating two rows of one thing, not two things.
 */
export const createGrinderListItemStyles = (theme: Theme): GrinderListItemStyleMap =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: theme.colors.surface,
      borderBottomWidth: theme.borderWidth.thin,
      borderBottomColor: theme.colors.divider,
    },
    notes: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.sm,
      gap: theme.spacing.xxs,
    },
  });
