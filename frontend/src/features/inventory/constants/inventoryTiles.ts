import type { TileGlyph } from '../../../components/ui';

import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';
import { BAG_FRESHNESS, type BagFreshness } from '../services/resolveBagFreshness';

/** The glyphs on the cupboard's action tiles. */
export const INVENTORY_TILE_ICONS = {
  scan: 'barcode-scan',
  manual: 'pencil-outline',
  grinders: 'cog-outline',
  brew: 'coffee-outline',
} as const satisfies Record<string, TileGlyph>;

/**
 * The heading over each band of the cupboard, and the line under it.
 *
 * Deliberately not the same strings as the badge on a card. A badge names one
 * bag's state - "Ideálne teraz" - and a heading names a shelf of them and says
 * what to do with it. Reusing one for the other would produce headings that
 * read as if the whole group were a single bag.
 */
export const BAG_GROUP_TITLE_KEYS: Record<BagFreshness, TranslationKey> = {
  [BAG_FRESHNESS.ideal]: TRANSLATION_KEYS.inventoryGroupIdeal,
  [BAG_FRESHNESS.aging]: TRANSLATION_KEYS.inventoryGroupAging,
  [BAG_FRESHNESS.pastPeak]: TRANSLATION_KEYS.inventoryGroupPastPeak,
  [BAG_FRESHNESS.resting]: TRANSLATION_KEYS.inventoryGroupResting,
  [BAG_FRESHNESS.unknown]: TRANSLATION_KEYS.inventoryGroupUnknown,
};

export const BAG_GROUP_CAPTION_KEYS: Record<BagFreshness, TranslationKey> = {
  [BAG_FRESHNESS.ideal]: TRANSLATION_KEYS.inventoryGroupIdealCaption,
  [BAG_FRESHNESS.aging]: TRANSLATION_KEYS.inventoryGroupAgingCaption,
  [BAG_FRESHNESS.pastPeak]: TRANSLATION_KEYS.inventoryGroupPastPeakCaption,
  [BAG_FRESHNESS.resting]: TRANSLATION_KEYS.inventoryGroupRestingCaption,
  [BAG_FRESHNESS.unknown]: TRANSLATION_KEYS.inventoryGroupUnknownCaption,
};
