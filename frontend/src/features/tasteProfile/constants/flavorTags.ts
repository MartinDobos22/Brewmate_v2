import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

/**
 * The flavour vocabulary Brewmate itself produces.
 *
 * The stored map accepts any tag - the vocabulary belongs to the world, not to
 * the code, and a coffee that tastes of jasmine must not need a migration.
 * These are simply the ones the questionnaire and the calibration reading can
 * write, and therefore the ones the app has a Slovak word for.
 */
export const FLAVOR_TAGS = {
  fruity: 'fruity',
  citrus: 'citrus',
  berry: 'berry',
  floral: 'floral',
  herbal: 'herbal',
  nutty: 'nutty',
  caramel: 'caramel',
  chocolate: 'chocolate',
  spice: 'spice',
  teaLike: 'tea_like',
} as const;

export type FlavorTag = (typeof FLAVOR_TAGS)[keyof typeof FLAVOR_TAGS];

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
