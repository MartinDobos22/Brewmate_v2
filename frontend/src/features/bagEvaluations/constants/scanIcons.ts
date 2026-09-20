import type { TileGlyph } from '../../../components/ui';

/** The glyphs on the scanner's tiles and in its argument. */
export const SCAN_ICONS = {
  camera: 'camera-outline',
  manual: 'pencil-outline',
  verdict: 'comment-question-outline',
  shop: 'storefront-outline',
  cupboard: 'package-variant-closed',
  /**
   * A reason is a neutral bullet, never a tick.
   *
   * Half of them argue against the coffee - "praženie je iné, než aké ti
   * zvykne sadnúť" is a reason - and a green check beside that sentence would
   * turn an argument into an endorsement of itself.
   */
  reason: 'circle-medium',
  gap: 'help-circle-outline',
  scan: 'barcode-scan',
} as const satisfies Record<string, TileGlyph>;

/**
 * What happened to the bag afterwards.
 *
 * A basket and a cross, which is what the two answers are - not a tick and a
 * cross, because leaving a coffee on the shelf is not a failure and the screen
 * must not read as though it were.
 */
export const OUTCOME_ICONS = {
  bought: 'basket-check-outline',
  left: 'close',
} as const satisfies Record<string, TileGlyph>;
