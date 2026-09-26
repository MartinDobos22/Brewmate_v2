import type { TileGlyph } from '../../../components/ui';
import type { ColorPalette } from '../../../theme';

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
 * Only the last two are a warning, and even those are ochre rather than red:
 * a month-old bag is a bag to drink this week, not a mistake.
 */
export const BAG_FRESHNESS_TONES = {
  [BAG_FRESHNESS.unknown]: 'muted',
  [BAG_FRESHNESS.resting]: 'muted',
  [BAG_FRESHNESS.ideal]: 'fresh',
  [BAG_FRESHNESS.pastPeak]: 'caution',
  [BAG_FRESHNESS.aging]: 'caution',
} as const;

/**
 * The same bands as they read inside an espresso block.
 *
 * A separate map rather than a translation of the one above, because the light
 * scheme's green and ochre are chosen against a warm white and both disappear
 * on brown. The distinction the reader needs is the same one - at its best,
 * running out of time, or nothing to go on - and only the paint differs.
 */
export const BAG_FRESHNESS_ESPRESSO_TONES = {
  [BAG_FRESHNESS.unknown]: 'onEspressoMuted',
  [BAG_FRESHNESS.resting]: 'onEspressoMuted',
  [BAG_FRESHNESS.ideal]: 'positiveOnEspresso',
  [BAG_FRESHNESS.pastPeak]: 'accent',
  [BAG_FRESHNESS.aging]: 'accent',
} as const;

/**
 * A glyph beside the words, because colour alone is not a statement.
 *
 * Somebody who cannot tell the green from the ochre still has to be able to
 * tell a bag at its best from one running out of time, and the sentence is
 * the same length either way.
 */
export const BAG_FRESHNESS_ICONS = {
  [BAG_FRESHNESS.unknown]: 'help-circle-outline',
  [BAG_FRESHNESS.resting]: 'timer-sand',
  [BAG_FRESHNESS.ideal]: 'check-circle',
  [BAG_FRESHNESS.pastPeak]: 'clock-outline',
  [BAG_FRESHNESS.aging]: 'clock-alert-outline',
} as const satisfies Record<BagFreshness, TileGlyph>;

/**
 * What the dial is drawn in. A colour role rather than a value, so the ring
 * and the sentence under it are painted from the same palette and cannot land
 * on two different greens.
 */
export const BAG_FRESHNESS_DIAL_COLORS = {
  [BAG_FRESHNESS.unknown]: 'outlineFaint',
  [BAG_FRESHNESS.resting]: 'primary',
  [BAG_FRESHNESS.ideal]: 'secondary',
  [BAG_FRESHNESS.pastPeak]: 'tertiary',
  [BAG_FRESHNESS.aging]: 'tertiary',
} as const satisfies Record<BagFreshness, keyof ColorPalette>;
