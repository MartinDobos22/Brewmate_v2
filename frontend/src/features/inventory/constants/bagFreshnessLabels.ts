import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';
import { BAG_FRESHNESS, type BagFreshness } from '../services/resolveBagFreshness';

/** What each band is called on a card in the cupboard. */
export const BAG_FRESHNESS_LABEL_KEYS: Record<BagFreshness, TranslationKey> = {
  [BAG_FRESHNESS.unknown]: TRANSLATION_KEYS.inventoryFreshnessUnknown,
  [BAG_FRESHNESS.resting]: TRANSLATION_KEYS.inventoryFreshnessResting,
  [BAG_FRESHNESS.ideal]: TRANSLATION_KEYS.inventoryFreshnessIdeal,
  [BAG_FRESHNESS.pastPeak]: TRANSLATION_KEYS.inventoryFreshnessPastPeak,
  [BAG_FRESHNESS.aging]: TRANSLATION_KEYS.inventoryFreshnessAging,
};

/**
 * Which colour role each band reads in.
 *
 * Only the last one is a warning, and even that is ochre rather than red:
 * a month-old bag is a bag to drink this week, not a mistake.
 */
export const BAG_FRESHNESS_TONES = {
  [BAG_FRESHNESS.unknown]: 'muted',
  [BAG_FRESHNESS.resting]: 'muted',
  [BAG_FRESHNESS.ideal]: 'secondary',
  [BAG_FRESHNESS.pastPeak]: 'muted',
  [BAG_FRESHNESS.aging]: 'tertiary',
} as const;
