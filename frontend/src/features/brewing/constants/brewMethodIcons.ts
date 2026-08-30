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

/** The glyph beside a coffee, and beside the answer that there is not one. */
export const PRE_BREW_COFFEE_ICONS = {
  bag: 'package-variant-closed',
  unknown: 'help-circle-outline',
} as const satisfies Record<string, TileGlyph>;
