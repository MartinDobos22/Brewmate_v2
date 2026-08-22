/**
 * The family a brewing method belongs to. The category is a closed set the
 * code branches on; the methods themselves are rows in `brew_methods`.
 */
export const BREW_METHOD_CATEGORIES = {
  pourOver: 'pour_over',
  immersion: 'immersion',
  espresso: 'espresso',
  cold: 'cold',
  stovetop: 'stovetop',
  batch: 'batch',
} as const;

export type BrewMethodCategory =
  (typeof BREW_METHOD_CATEGORIES)[keyof typeof BREW_METHOD_CATEGORIES];

/** Tuple form, required by Drizzle's `pgEnum`. */
export const BREW_METHOD_CATEGORY_VALUES = [
  BREW_METHOD_CATEGORIES.pourOver,
  BREW_METHOD_CATEGORIES.immersion,
  BREW_METHOD_CATEGORIES.espresso,
  BREW_METHOD_CATEGORIES.cold,
  BREW_METHOD_CATEGORIES.stovetop,
  BREW_METHOD_CATEGORIES.batch,
] as const;
