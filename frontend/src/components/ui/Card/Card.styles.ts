import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type CardStyleMap = ViewStyles<
  'base' | 'surface' | 'container' | 'containerHigh' | 'outlined' | 'soft' | 'softEmphasis'
>;

/**
 * Two generations of card, side by side while the redesign lands.
 *
 * The old ones are told apart by their surface and a quiet outline; a card in
 * a list never floats. The `soft` pair is the A2 card, where depth replaced
 * the hairline outright - same surface, no border, and a shadow that says
 * which of two cards on a screen matters more. A screen opts into the newer
 * shape by naming it, so nothing changes under a screen nobody has rebuilt.
 */
export const createCardStyles = (theme: Theme): CardStyleMap =>
  StyleSheet.create({
    base: {
      borderRadius: theme.shape.card,
      padding: theme.layout.cardPadding,
      gap: theme.spacing.sm,
      overflow: 'hidden',
    },
    surface: { backgroundColor: theme.colors.surface },
    container: { backgroundColor: theme.colors.surfaceContainer },
    containerHigh: { backgroundColor: theme.colors.surfaceContainerHigh },
    outlined: {
      backgroundColor: theme.colors.surface,
      borderWidth: theme.borderWidth.thin,
      borderColor: theme.colors.outlineVariant,
    },
    soft: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.shape.softCard,
      padding: theme.spacing.lgPlus,
      gap: theme.spacing.lg,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.card,
    },
    /** The one card on a screen that matters more than the ones around it. */
    softEmphasis: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.shape.softCard,
      padding: theme.spacing.lgPlus,
      gap: theme.spacing.lg,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.cardEmphasis,
    },
  });
