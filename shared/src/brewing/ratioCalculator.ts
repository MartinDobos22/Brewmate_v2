import {
  BREW_RATIO_MAX,
  BREW_RATIO_MIN,
  DOSE_GRAMS_MAX,
  DOSE_GRAMS_MIN,
  WATER_GRAMS_MAX,
  WATER_GRAMS_MIN,
} from './brewingFieldLimits.js';

/** Ratios are read as "1:16,5"; the digit after that is noise on a scale. */
export const RATIO_DECIMALS = 1;

/** No domestic scale resolves better than a tenth of a gram. */
export const GRAMS_DECIMALS = 1;

const ROUNDING_BASE = 10;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const round = (value: number, decimals: number): number => {
  const factor = ROUNDING_BASE ** decimals;

  return Math.round(value * factor) / factor;
};

/**
 * The three sides of one triangle: dose, water and the ratio between them.
 *
 * In `shared` rather than in the app, because both ends of the wire compute
 * them. The calculator on the pre-brew screen fills in whichever value the
 * user did not touch last, and the server recomputes the ratio whenever a chat
 * patch moves the dose or the water - two implementations of the same
 * arithmetic are two implementations that eventually round differently, and
 * the number they disagree about is the one printed on the recipe card.
 *
 * Every result is clamped into the bounds the schema will accept, so a value
 * that came back from here cannot fail validation later.
 */
export const resolveWaterGrams = (doseGrams: number, ratio: number): number =>
  round(clamp(doseGrams * ratio, WATER_GRAMS_MIN, WATER_GRAMS_MAX), GRAMS_DECIMALS);

export const resolveDoseGrams = (waterGrams: number, ratio: number): number =>
  round(clamp(waterGrams / ratio, DOSE_GRAMS_MIN, DOSE_GRAMS_MAX), GRAMS_DECIMALS);

export const resolveRatio = (doseGrams: number, waterGrams: number): number =>
  round(clamp(waterGrams / doseGrams, BREW_RATIO_MIN, BREW_RATIO_MAX), RATIO_DECIMALS);
