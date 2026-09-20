import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type InventoryHeaderStyleMap = ViewStyles<'row' | 'buttons' | 'button' | 'scan' | 'pressed'>;

/**
 * The title, and the two ways to put a coffee on the shelf beside it.
 *
 * They used to be two full-width tiles under the summary, which meant the more
 * coffee somebody owned the further they had to scroll to add more. As round
 * buttons in the title row they are in the same place on a full cupboard and
 * an empty one - and the scanner is the dark one, because it is the one that
 * does the typing for you.
 */
export const createInventoryHeaderStyles = (theme: Theme): InventoryHeaderStyleMap =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },
    buttons: { flexDirection: 'row', gap: theme.spacing.sm },
    button: {
      width: theme.size.headerButtonSize,
      height: theme.size.headerButtonSize,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.card,
    },
    scan: {
      backgroundColor: theme.colors.espresso,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.buttonDark,
    },
    pressed: { opacity: theme.opacity.pressed },
  });
