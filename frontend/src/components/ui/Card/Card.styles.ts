import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type CardStyleMap = ViewStyles<'base' | 'surface' | 'container' | 'containerHigh' | 'outlined'>;

/**
 * Cards are told apart by their surface, not by a shadow. A card in a list
 * never floats - it has its own surface colour and a quiet outline.
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
  });
