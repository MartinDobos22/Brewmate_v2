import { StyleSheet, type ViewStyle } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type HomeCupboardStyleMap = ViewStyles<
  | 'section'
  | 'heading'
  | 'title'
  | 'list'
  | 'row'
  | 'body'
  | 'divider'
  | 'empty'
  | 'badge'
  | 'pressed'
>;

/**
 * What is on the shelf, as a list rather than as a tile.
 *
 * A number on a tile answers "how much coffee do I own", which is not a
 * question anybody opens an app to ask. The bags themselves answer the one
 * that is: which of these should I be drinking. So the heading carries the
 * total - where there is one to carry - and the rows carry the shelf.
 *
 * The rows share one card with hairlines between them rather than sitting as
 * separate cards, because they are read down as a list. Separate cards would
 * make three coffees look like three decisions.
 */
export const createHomeCupboardStyles = (theme: Theme): HomeCupboardStyleMap =>
  StyleSheet.create({
    section: { gap: theme.spacing.md },
    heading: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.xxs,
    },
    title: { flexShrink: 1, minWidth: 0 },
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
      gap: theme.spacing.lg,
      padding: theme.spacing.lg,
    },
    body: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
    /** Inset past the spine, so the marks form a column and the rows read as one list. */
    divider: {
      height: theme.borderWidth.thin,
      marginLeft: theme.spacing.xxxl,
      backgroundColor: theme.colors.divider,
    },
    empty: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.lg,
      padding: theme.spacing.lgPlus,
      borderRadius: theme.shape.softCard,
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.card,
    },
    badge: {
      width: theme.size.emptyRowBadge,
      height: theme.size.emptyRowBadge,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.surfaceVariant,
    },
    pressed: { opacity: theme.opacity.pressed },
  });

/**
 * The coloured spine down the left of a row.
 *
 * The colour is the band the bag is in, which is the same colour its dial
 * carries in the cupboard itself - so a bag is the same green in both places
 * rather than being described twice in two palettes.
 */
export const bagSpine = (theme: Theme, color: string): ViewStyle => ({
  width: theme.size.bagSpineWidth,
  height: theme.size.bagSpineHeight,
  borderRadius: theme.shape.pill,
  backgroundColor: color,
});
