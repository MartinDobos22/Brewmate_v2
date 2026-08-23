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

/**
 * The bands the cupboard prints beside a bag, in days since roasting.
 *
 * Narrower than `RESTING_DAYS` above, and deliberately a different thing. That
 * one is the window the shop verdict argues about - is this bag worth buying
 * at all - and it is generous on both sides because a bag bought today will be
 * drunk over the next month. This one is about the coffee sitting on somebody's
 * shelf right now, so it says what to do with it this morning: leave it alone,
 * drink it, or drink it soon.
 *
 * The fourth band, between the ideal window and the aging one, is the honest
 * consequence of the other three: a three-week-old bag is neither at its best
 * nor going off, and saying so beats rounding it into one of the neighbours.
 */
export const BAG_FRESHNESS_DAYS = {
  restingUntil: 4,
  idealUntil: 21,
  agingFrom: 30,
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
