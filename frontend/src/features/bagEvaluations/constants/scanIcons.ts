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
} as const satisfies Record<string, TileGlyph>;
