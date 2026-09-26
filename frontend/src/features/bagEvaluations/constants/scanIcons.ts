import type { TileGlyph } from '../../../components/ui';

import { SCAN_OUTCOMES, type ScanOutcome } from './scanOutcomes';

/** The glyphs on the scanner's tiles and in its argument. */
export const SCAN_ICONS = {
  camera: 'camera-outline',
  /** On the button rather than beside the heading, so it reads as the act. */
  capture: 'camera',
  library: 'image-outline',
  /** The window standing in for a photograph nobody has taken yet. */
  viewfinder: 'image-filter-center-focus-weak',
  history: 'history',
  manual: 'pencil-outline',
  verdict: 'comment-question-outline',
  shop: 'storefront-outline',
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
export const OUTCOME_ICONS: Record<ScanOutcome, TileGlyph> = {
  [SCAN_OUTCOMES.bought]: 'basket-check-outline',
  [SCAN_OUTCOMES.left]: 'close-circle-outline',
  /**
   * Neither, which is the ordinary case: somebody who asked about a bag and
   * never came back to say. A question mark rather than an empty slot, so the
   * column of marks stays a column.
   */
  [SCAN_OUTCOMES.undecided]: 'help-circle-outline',
};
