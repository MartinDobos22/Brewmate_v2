import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type OptionCardStyleMap = ViewStyles<
  'base' | 'unselected' | 'selected' | 'pressed' | 'disabled' | 'content'
>;

/**
 * A whole card is the touch target, not a control inside it. Onboarding is
 * answered one-handed, often walking, and a card that has to be aimed at is a
 * card that gets answered wrongly.
 */
export const createOptionCardStyles = (theme: Theme): OptionCardStyleMap =>
  StyleSheet.create({
    base: {
      minHeight: theme.size.optionCardMinHeight,
      justifyContent: 'center',
      padding: theme.layout.cardPadding,
      borderRadius: theme.shape.card,
      borderWidth: theme.borderWidth.thin,
    },
    unselected: { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant },
    selected: {
      backgroundColor: theme.colors.secondaryContainer,
      borderColor: theme.colors.secondary,
      borderWidth: theme.borderWidth.thick,
    },
    pressed: { opacity: theme.opacity.pressed },
    disabled: { opacity: theme.opacity.disabled },
    content: { gap: theme.spacing.xxs },
  });
