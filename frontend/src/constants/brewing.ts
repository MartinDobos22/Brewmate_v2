/**
 * Domain constants for brewing. They live here rather than in a screen so the
 * day a rule changes, it changes in exactly one place.
 */

/** How long a roast rests before it is at its best, in days. */
export const RESTING_DAYS = {
  min: 3,
  recommended: 10,
  filterOptimum: 14,
  espressoOptimum: 21,
  max: 60,
} as const;

/** Coffee-to-water ratio, expressed as parts of water per part of coffee. */
export const BREW_RATIO = {
  min: 10,
  filterDefault: 16,
  max: 20,
  step: 0.5,
} as const;

/** Water temperature in degrees Celsius. */
export const WATER_TEMPERATURE_C = {
  min: 80,
  default: 93,
  max: 100,
  step: 1,
} as const;

/** Dose of dry coffee in grams. */
export const DOSE_GRAMS = {
  min: 5,
  default: 18,
  max: 60,
  step: 0.5,
} as const;

/** Total brew time in seconds. */
export const BREW_TIME_SECONDS = {
  min: 20,
  filterDefault: 180,
  max: 600,
} as const;

/** Abstract grind scale, normalised across grinders. */
export const GRIND_SETTING = {
  min: 1,
  default: 50,
  max: 100,
  step: 1,
} as const;
