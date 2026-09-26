import type { TileGlyph } from '../../../components/ui';
import type { TasteAxisName } from './tasteAxes';

/**
 * One glyph per axis, and the same one everywhere it appears.
 *
 * The web carries it beside the axis name and the row underneath carries it
 * again, which is the point rather than a duplication: it is what makes the
 * picture and the sentences visibly two readings of one dataset instead of two
 * things a reader has to line up for themselves.
 *
 * Each names the thing the axis is about rather than a level of it - a citrus
 * for acidity, a leaf for bitterness - because a glyph that implied "more" or
 * "less" would be grading a preference nobody graded.
 */
export const TASTE_AXIS_ICONS = {
  acidity: 'fruit-citrus',
  sweetness: 'candy-outline',
  body: 'water',
  bitterness: 'leaf',
  intensity: 'flash-outline',
} as const satisfies Record<TasteAxisName, TileGlyph>;
