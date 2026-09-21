import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type ListItemStyleMap = ViewStyles<
  'base' | 'pressed' | 'mark' | 'content' | 'trailing' | 'divider'
>;

/**
 * A row, on the card it sits on rather than on a surface of its own.
 *
 * It used to paint itself the surface colour, which is the colour of the card
 * under it - so the fill did nothing except stop the card's own ground
 * showing through, and a row on any other ground was drawn as a white block
 * on it. Transparent, the row is the card, and the only thing separating two
 * of them is the rule between - `divider`, which is the colour role that
 * exists for exactly that and is a shade quieter than the outline it used.
 */
export const createListItemStyles = (theme: Theme): ListItemStyleMap =>
  StyleSheet.create({
    base: {
      minHeight: theme.size.listItemMinHeight,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.shape.listItem,
    },
    pressed: { backgroundColor: theme.colors.surfaceVariant },
    /** The mark keeps a column of its own, so a list of rows reads as one. */
    mark: { width: theme.size.iconRow, alignItems: 'center' },
    content: { flex: 1, gap: theme.spacing.xxs },
    trailing: { alignItems: 'flex-end', justifyContent: 'center' },
    divider: {
      borderBottomWidth: theme.borderWidth.thin,
      borderBottomColor: theme.colors.divider,
      borderBottomLeftRadius: theme.radius.none,
      borderBottomRightRadius: theme.radius.none,
    },
  });
