import type { ColorPalette } from '../../../../theme';
import { BAG_FRESHNESS, type BagFreshness } from '../../services/resolveBagFreshness';

/**
 * What the glyph beside the words is painted in.
 *
 * The same decision as the sentence's tone, expressed as a palette key rather
 * than as a text tone, because an icon takes a colour and a `Text` takes a
 * role. Keeping them in one file is what stops the two halves of one line
 * landing on different greens.
 */
export const STATUS_ICON_COLORS = {
  [BAG_FRESHNESS.unknown]: 'onSurfaceVariant',
  [BAG_FRESHNESS.resting]: 'onSurfaceVariant',
  [BAG_FRESHNESS.ideal]: 'onFresh',
  [BAG_FRESHNESS.pastPeak]: 'onCaution',
  [BAG_FRESHNESS.aging]: 'onCaution',
} as const satisfies Record<BagFreshness, keyof ColorPalette>;
