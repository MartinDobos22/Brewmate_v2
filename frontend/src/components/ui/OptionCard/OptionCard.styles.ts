import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type OptionCardStyleMap = ViewStyles<
  | 'base'
  | 'unselected'
  | 'selected'
  | 'pressed'
  | 'disabled'
  | 'row'
  | 'badge'
  | 'badgeSelected'
  | 'content'
  | 'trailing'
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
    row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
    /**
     * The glyph's disc, which is what makes a column of these scannable at
     * arm's length: the eye finds a shape before it reads a word.
     */
    badge: {
      width: theme.size.tileBadgeSize,
      height: theme.size.tileBadgeSize,
      borderRadius: theme.shape.avatar,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceContainer,
    },
    badgeSelected: { backgroundColor: theme.colors.surface },
    content: { flexShrink: 1, flexGrow: 1, flexBasis: 0, gap: theme.spacing.xxs },
    trailing: { alignItems: 'flex-end' },
  });
