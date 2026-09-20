import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

import type { ActionRowTone } from './actionRowTones';

type ActionRowStyleMap = ViewStyles<
  | 'base'
  | 'badge'
  | 'body'
  | 'pressed'
  | ActionRowTone
  | 'badgeEspresso'
  | 'badgeSurface'
  | 'badgeFresh'
>;

/**
 * A row that leads somewhere: a glyph in a circle, what it is, and a chevron.
 *
 * Used wherever a screen offers two or three ways forward and each needs a
 * sentence rather than a word - an empty cupboard, the scanner's two intents.
 * Tiles are for destinations that need no explaining; this is for the ones
 * that do.
 */
export const createActionRowStyles = (theme: Theme): ActionRowStyleMap =>
  StyleSheet.create({
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.lg,
      padding: theme.spacing.lg,
      borderRadius: theme.shape.insetBlock,
    },
    espresso: {
      backgroundColor: theme.colors.espresso,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.cardSelected,
    },
    surface: {
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.card,
    },
    fresh: { backgroundColor: theme.colors.freshContainer },
    badge: {
      width: theme.size.headerButtonSize,
      height: theme.size.headerButtonSize,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.shape.pill,
    },
    badgeEspresso: { backgroundColor: theme.colors.espressoDeep },
    badgeSurface: { backgroundColor: theme.colors.surfaceVariant },
    badgeFresh: { backgroundColor: theme.colors.background },
    body: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
    pressed: { opacity: theme.opacity.pressed },
  });
