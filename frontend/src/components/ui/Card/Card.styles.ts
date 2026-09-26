import { StyleSheet, type ViewStyle } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

import { CARD_ELEVATIONS, type CardDepth } from './cardDepths';

type CardStyleMap = ViewStyles<'base'>;

/**
 * One card, with no border on it.
 *
 * The app used to tell two cards apart by their surface and a hairline, which
 * meant six variants for what turned out to be one object: four of them
 * differed by a tint no reader compares across a scroll, and the outline was
 * on every card whether or not it was separating anything. Depth replaced it
 * outright - so a screen's cards are the same colour as each other and the
 * only card that stands out is the one that was meant to.
 */
export const createCardStyles = (theme: Theme): CardStyleMap =>
  StyleSheet.create({
    base: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.shape.softCard,
      padding: theme.spacing.lgPlus,
      gap: theme.spacing.lg,
    },
  });

/**
 * The shadow, which cannot live in the stylesheet: its tint is a colour role
 * and its geometry is picked per card.
 *
 * `overflow` is deliberately not set here. A card that clips its own content
 * clips its shadow with it on Android, which is the whole of what this is.
 */
export const cardElevation = (theme: Theme, depth: CardDepth): ViewStyle => ({
  shadowColor: theme.colors.espresso,
  ...theme.elevation[CARD_ELEVATIONS[depth]],
});
