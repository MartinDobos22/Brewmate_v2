import { FLAVOR_TAGS, type FlavorTag } from '@brewmate/shared';

import type { TileGlyph } from '../../../components/ui';
import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

/**
 * The flavour vocabulary lives in `@brewmate/shared`, because the server now
 * writes it too - a bag bought or rated teaches the flavours its label prints.
 * Re-exported here so everything that draws a flavour keeps one import.
 */
export { FLAVOR_TAGS };
export type { FlavorTag };

/** A tag outside this map is shown as it was stored, the way a bag's name is. */
export const FLAVOR_TAG_LABEL_KEYS: Record<FlavorTag, TranslationKey> = {
  [FLAVOR_TAGS.fruity]: TRANSLATION_KEYS.flavorFruity,
  [FLAVOR_TAGS.citrus]: TRANSLATION_KEYS.flavorCitrus,
  [FLAVOR_TAGS.berry]: TRANSLATION_KEYS.flavorBerry,
  [FLAVOR_TAGS.floral]: TRANSLATION_KEYS.flavorFloral,
  [FLAVOR_TAGS.herbal]: TRANSLATION_KEYS.flavorHerbal,
  [FLAVOR_TAGS.nutty]: TRANSLATION_KEYS.flavorNutty,
  [FLAVOR_TAGS.caramel]: TRANSLATION_KEYS.flavorCaramel,
  [FLAVOR_TAGS.chocolate]: TRANSLATION_KEYS.flavorChocolate,
  [FLAVOR_TAGS.spice]: TRANSLATION_KEYS.flavorSpice,
  [FLAVOR_TAGS.teaLike]: TRANSLATION_KEYS.flavorTeaLike,
};

/**
 * A tag has to be liked, or disliked, by more than a rounding error before it
 * is worth printing. Below this the profile would be showing noise from a
 * single blended answer as if it were a preference.
 */
export const FLAVOR_AFFINITY_DISPLAY_MIN = 0.12;

/** The profile shows the strongest few, not the whole vocabulary. */
export const FLAVOR_AFFINITY_DISPLAY_MAX = 6;

/**
 * One glyph per flavour the app has a word for.
 *
 * A tag Brewmate has never met gets no mark rather than a guessed one: the
 * vocabulary belongs to the world, and drawing a cookie beside a word nobody
 * wrote a rule for would be the interface inventing a classification.
 */
export const FLAVOR_TAG_ICONS = {
  [FLAVOR_TAGS.fruity]: 'fruit-cherries',
  [FLAVOR_TAGS.citrus]: 'fruit-citrus',
  [FLAVOR_TAGS.berry]: 'fruit-grapes',
  [FLAVOR_TAGS.floral]: 'flower-outline',
  [FLAVOR_TAGS.herbal]: 'leaf',
  [FLAVOR_TAGS.nutty]: 'peanut-outline',
  [FLAVOR_TAGS.caramel]: 'candy-outline',
  [FLAVOR_TAGS.chocolate]: 'cookie-outline',
  [FLAVOR_TAGS.spice]: 'fire',
  [FLAVOR_TAGS.teaLike]: 'tea-outline',
} as const satisfies Record<FlavorTag, TileGlyph>;
