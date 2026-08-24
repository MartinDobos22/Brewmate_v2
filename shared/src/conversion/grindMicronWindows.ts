import { BREW_METHOD_CATEGORIES, type BrewMethodCategory } from '../enums/brewMethodCategories.js';

import {
  BATCH_MICRONS_MAX,
  BATCH_MICRONS_MIN,
  COLD_MICRONS_MAX,
  COLD_MICRONS_MIN,
  ESPRESSO_MICRONS_MAX,
  ESPRESSO_MICRONS_MIN,
  IMMERSION_MICRONS_MAX,
  IMMERSION_MICRONS_MIN,
  POUR_OVER_MICRONS_MAX,
  POUR_OVER_MICRONS_MIN,
  STOVETOP_MICRONS_MAX,
  STOVETOP_MICRONS_MIN,
} from './conversionFieldLimits.js';
import type { MicronWindow } from './micronWindowSchema.js';

const HALF = 2;

/**
 * Where each brewing family normally grinds, in microns.
 *
 * A total map rather than a lookup with a fallback: adding a category to the
 * contract should be a type error here, not a conversion that silently treats
 * a new kind of brewer as a pour-over.
 *
 * This table is the last resort, used only when a recipe's author never said
 * what they ground on and never described it either. What it produces is
 * explicitly a starting point - which is what every converted grind is anyway.
 */
export const GRIND_MICRON_WINDOWS: Record<BrewMethodCategory, MicronWindow> = {
  [BREW_METHOD_CATEGORIES.espresso]: { min: ESPRESSO_MICRONS_MIN, max: ESPRESSO_MICRONS_MAX },
  [BREW_METHOD_CATEGORIES.pourOver]: { min: POUR_OVER_MICRONS_MIN, max: POUR_OVER_MICRONS_MAX },
  [BREW_METHOD_CATEGORIES.immersion]: { min: IMMERSION_MICRONS_MIN, max: IMMERSION_MICRONS_MAX },
  [BREW_METHOD_CATEGORIES.stovetop]: { min: STOVETOP_MICRONS_MIN, max: STOVETOP_MICRONS_MAX },
  [BREW_METHOD_CATEGORIES.batch]: { min: BATCH_MICRONS_MIN, max: BATCH_MICRONS_MAX },
  [BREW_METHOD_CATEGORIES.cold]: { min: COLD_MICRONS_MIN, max: COLD_MICRONS_MAX },
};

/** The middle of a family's window, which is where a conversion starts from. */
export const middleOfWindow = (window: MicronWindow): number => (window.min + window.max) / HALF;
