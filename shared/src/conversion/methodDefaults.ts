import { BREW_METHOD_CATEGORIES, type BrewMethodCategory } from '../enums/brewMethodCategories.js';

import {
  BATCH_DEFAULT_DOSE_GRAMS,
  BATCH_DEFAULT_TEMP_C,
  COLD_DEFAULT_DOSE_GRAMS,
  COLD_DEFAULT_TEMP_C,
  ESPRESSO_DEFAULT_DOSE_GRAMS,
  ESPRESSO_DEFAULT_TEMP_C,
  IMMERSION_DEFAULT_DOSE_GRAMS,
  IMMERSION_DEFAULT_TEMP_C,
  POUR_OVER_DEFAULT_DOSE_GRAMS,
  POUR_OVER_DEFAULT_TEMP_C,
  STOVETOP_DEFAULT_DOSE_GRAMS,
  STOVETOP_DEFAULT_TEMP_C,
} from './conversionFieldLimits.js';

/**
 * What a recipe falls back to when the one it was converted from never said.
 *
 * Both maps are total over the categories, so adding a family of brewer to the
 * contract is a type error here rather than a conversion that quietly treats a
 * new kind of machine as a dripper.
 *
 * Nothing in these tables is a claim about anybody's taste. They exist so that
 * a recipe pasted in as three lines still comes out as a recipe somebody can
 * follow, and every number taken from here is reported as `unknown` rather
 * than dressed up as a conversion of something.
 */
export const DEFAULT_DOSE_GRAMS: Record<BrewMethodCategory, number> = {
  [BREW_METHOD_CATEGORIES.espresso]: ESPRESSO_DEFAULT_DOSE_GRAMS,
  [BREW_METHOD_CATEGORIES.pourOver]: POUR_OVER_DEFAULT_DOSE_GRAMS,
  [BREW_METHOD_CATEGORIES.immersion]: IMMERSION_DEFAULT_DOSE_GRAMS,
  [BREW_METHOD_CATEGORIES.stovetop]: STOVETOP_DEFAULT_DOSE_GRAMS,
  [BREW_METHOD_CATEGORIES.batch]: BATCH_DEFAULT_DOSE_GRAMS,
  [BREW_METHOD_CATEGORIES.cold]: COLD_DEFAULT_DOSE_GRAMS,
};

export const DEFAULT_WATER_TEMP_C: Record<BrewMethodCategory, number> = {
  [BREW_METHOD_CATEGORIES.espresso]: ESPRESSO_DEFAULT_TEMP_C,
  [BREW_METHOD_CATEGORIES.pourOver]: POUR_OVER_DEFAULT_TEMP_C,
  [BREW_METHOD_CATEGORIES.immersion]: IMMERSION_DEFAULT_TEMP_C,
  [BREW_METHOD_CATEGORIES.stovetop]: STOVETOP_DEFAULT_TEMP_C,
  [BREW_METHOD_CATEGORIES.batch]: BATCH_DEFAULT_TEMP_C,
  [BREW_METHOD_CATEGORIES.cold]: COLD_DEFAULT_TEMP_C,
};
