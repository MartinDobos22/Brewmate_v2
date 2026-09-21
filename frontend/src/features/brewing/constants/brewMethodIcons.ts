import { BREW_METHOD_CATEGORIES, type BrewMethodCategory } from '@brewmate/shared';

import type { TileGlyph } from '../../../components/ui';
import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

/**
 * A glyph per method *category*, never per method.
 *
 * `brew_methods` are rows, and nothing in this application branches on `key` -
 * adding V60 Switch is an insert, not a release. An icon table keyed by `key`
 * would quietly break that: the next method somebody seeds would arrive on
 * this screen with a blank square where every other one has a picture. A
 * category is a closed set the code already branches on, so a new row inherits
 * the right glyph by being what it is.
 */
export const BREW_METHOD_CATEGORY_ICONS = {
  [BREW_METHOD_CATEGORIES.pourOver]: 'filter-outline',
  [BREW_METHOD_CATEGORIES.immersion]: 'cup-outline',
  [BREW_METHOD_CATEGORIES.espresso]: 'coffee-maker-outline',
  [BREW_METHOD_CATEGORIES.cold]: 'snowflake',
  [BREW_METHOD_CATEGORIES.stovetop]: 'fire',
  [BREW_METHOD_CATEGORIES.batch]: 'coffee-maker',
} as const satisfies Record<BrewMethodCategory, TileGlyph>;

/** What each family is called, under the method's own name. */
export const BREW_METHOD_CATEGORY_LABEL_KEYS: Record<BrewMethodCategory, TranslationKey> = {
  [BREW_METHOD_CATEGORIES.pourOver]: TRANSLATION_KEYS.preBrewMethodCategoryPourOver,
  [BREW_METHOD_CATEGORIES.immersion]: TRANSLATION_KEYS.preBrewMethodCategoryImmersion,
  [BREW_METHOD_CATEGORIES.espresso]: TRANSLATION_KEYS.preBrewMethodCategoryEspresso,
  [BREW_METHOD_CATEGORIES.cold]: TRANSLATION_KEYS.preBrewMethodCategoryCold,
  [BREW_METHOD_CATEGORIES.stovetop]: TRANSLATION_KEYS.preBrewMethodCategoryStovetop,
  [BREW_METHOD_CATEGORIES.batch]: TRANSLATION_KEYS.preBrewMethodCategoryBatch,
};

/**
 * The glyphs on the row that reports which coffee is being brewed.
 *
 * A bean rather than a bag for the coffee itself: the row is about what is
 * being brewed, not about the packet it came in - and the packet is what marks
 * the case where there is no coffee written down at all.
 */
export const PRE_BREW_COFFEE_ICONS = {
  bag: 'seed-outline',
  unknown: 'package-variant-closed',
  remaining: 'scale-bathroom',
  change: 'swap-horizontal',
  photo: 'camera',
} as const satisfies Record<string, TileGlyph>;

/**
 * An account with no brewer written down, which is what the quick-brew flow
 * hits before onboarding has been through.
 *
 * The same glyph the brewers step of onboarding carries, because that is
 * exactly where this screen's one action goes. A different picture for the
 * same piece of equipment would make the destination look like a third thing
 * to do rather than the answer to the sentence above it.
 */
export const EMPTY_BREW_METHODS_ICON = 'filter-outline' satisfies TileGlyph;
