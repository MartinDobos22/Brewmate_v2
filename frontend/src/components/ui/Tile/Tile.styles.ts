import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type TileStyleMap = ViewStyles<
  | 'base'
  | 'primary'
  | 'accent'
  | 'neutral'
  | 'pressed'
  | 'header'
  | 'badge'
  | 'badgePrimary'
  | 'badgeAccent'
  | 'badgeNeutral'
  | 'body'
  | 'heading'
  | 'rings'
  | 'ringOuter'
  | 'ringInner'
  | 'ringPrimary'
  | 'ringAccent'
  | 'ringNeutral'
>;

/**
 * A tile is a card that has been given a shape.
 *
 * It keeps the card's radius and padding, so a tile beside a card does not
 * look like a different product, and adds the two things a grid needs: a floor
 * under its height, and a share of the row it sits in. Both are expressed as
 * flex weights rather than measured widths - a tile is correct on its first
 * frame, without waiting for a layout pass to tell it how wide the phone is.
 */
export const createTileStyles = (theme: Theme): TileStyleMap =>
  StyleSheet.create({
    base: {
      flexGrow: 1,
      flexBasis: 0,
      minHeight: theme.size.tileMinHeight,
      borderRadius: theme.shape.card,
      padding: theme.layout.cardPadding,
      gap: theme.spacing.sm,
      justifyContent: 'space-between',
      overflow: 'hidden',
    },
    primary: { backgroundColor: theme.colors.primaryContainer },
    accent: { backgroundColor: theme.colors.secondaryContainer },
    neutral: {
      backgroundColor: theme.colors.surface,
      borderWidth: theme.borderWidth.thin,
      borderColor: theme.colors.outlineVariant,
    },
    pressed: { opacity: theme.opacity.pressed },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
    },
    badge: {
      width: theme.size.tileBadgeSize,
      height: theme.size.tileBadgeSize,
      borderRadius: theme.shape.avatar,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgePrimary: { backgroundColor: theme.colors.surface },
    badgeAccent: { backgroundColor: theme.colors.surface },
    badgeNeutral: { backgroundColor: theme.colors.surfaceContainer },

    heading: { gap: theme.spacing.xxs },
    /**
     * What the tile reports, pinned to the bottom by the space between the
     * three blocks. A number or a chart belongs under the words that say what
     * it counts - above them it is a figure nobody can name yet.
     */
    body: { gap: theme.spacing.xs },

    /**
     * The decoration, clipped by the tile's own `overflow: hidden`. Pushed off
     * the corner so what shows is an arc rather than two complete circles -
     * a mark, not a diagram.
     */
    rings: {
      position: 'absolute',
      top: theme.size.tileRingOffset,
      right: theme.size.tileRingOffset,
      width: theme.size.tileRingOuter,
      height: theme.size.tileRingOuter,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: theme.opacity.watermark,
    },
    ringOuter: {
      position: 'absolute',
      width: theme.size.tileRingOuter,
      height: theme.size.tileRingOuter,
      borderRadius: theme.shape.avatar,
      borderWidth: theme.borderWidth.thick,
    },
    ringInner: {
      width: theme.size.tileRingInner,
      height: theme.size.tileRingInner,
      borderRadius: theme.shape.avatar,
      borderWidth: theme.borderWidth.thick,
    },
    ringPrimary: { borderColor: theme.colors.primary },
    ringAccent: { borderColor: theme.colors.secondary },
    ringNeutral: { borderColor: theme.colors.outline },
  });
