import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ScanHistoryListStyleMap = ViewStyles<
  'section' | 'heading' | 'title' | 'list' | 'row' | 'body' | 'divider' | 'pressed'
>;

/**
 * Every bag this account has already been weighed up on, as a list rather
 * than as a stack of cards.
 *
 * Here so the same coffee is not asked about twice - a shelf is exactly where
 * somebody picks up the same bag a second time, and being told "toto som ti už
 * hodnotil" with the answer beside it is more useful than a fresh opinion
 * about it.
 *
 * What happened afterwards is the whole reason the list is worth scrolling:
 * whether the bag was bought is the only thing this app ever learns about
 * whether it was any good at this. So it is the line under the name, with its
 * own glyph, rather than a badge somewhere on a card.
 */
export const createScanHistoryListStyles = (theme: Theme): ScanHistoryListStyleMap =>
  StyleSheet.create({
    section: { gap: theme.spacing.md },
    heading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xxs,
    },
    title: { flex: 1, minWidth: 0 },
    list: {
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
      paddingHorizontal: theme.spacing.lg,
    },
    body: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
    /** Inset past the glyph, so the marks form a column and the rows read as one list. */
    divider: {
      height: theme.borderWidth.thin,
      marginLeft: theme.spacing.xxxl,
      backgroundColor: theme.colors.divider,
    },
    pressed: { opacity: theme.opacity.pressed },
  });
