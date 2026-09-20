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
 *
 * An answered card goes to the espresso brown rather than gaining a thicker
 * border. A column of cards is read by weight before it is read by outline, so
 * the one that was chosen has to be the dark one - a border two points thicker
 * than its neighbours is a difference somebody has to look for, and this is
 * the screen where they are looking at the next question instead.
 */
export const createOptionCardStyles = (theme: Theme): OptionCardStyleMap =>
  StyleSheet.create({
    base: {
      minHeight: theme.size.optionCardMinHeight,
      justifyContent: 'center',
      padding: theme.spacing.lg,
      borderRadius: theme.shape.softCard,
    },
    unselected: {
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.card,
    },
    selected: {
      backgroundColor: theme.colors.espresso,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.cardSelected,
    },
    pressed: { opacity: theme.opacity.pressed },
    disabled: { opacity: theme.opacity.disabled },
    row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.lg },
    /**
     * The glyph's disc, which is what makes a column of these scannable at
     * arm's length: the eye finds a shape before it reads a word.
     */
    badge: {
      width: theme.size.optionBadgeSize,
      height: theme.size.optionBadgeSize,
      borderRadius: theme.shape.avatar,
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 0,
      flexShrink: 0,
      backgroundColor: theme.colors.surfaceVariant,
    },
    badgeSelected: { backgroundColor: theme.colors.espressoDeep },
    content: { flexShrink: 1, flexGrow: 1, flexBasis: 0, gap: theme.spacing.xxs },
    trailing: { alignItems: 'flex-end' },
  });
