import { BREW_METHOD_CATEGORIES, type BrewMethodCategory } from '@brewmate/shared';

/**
 * The reference brew.
 *
 * Deliberately unremarkable numbers: the point of this cup is not to be the
 * best coffee somebody has made, it is to be a cup Brewmate knows the recipe
 * for, so that whatever the drinker says about it can be read as a difference
 * from a known starting point.
 */
export const CALIBRATION_RECIPE = {
  doseGrams: 15,
  espressoDoseGrams: 18,
  /** Only offered when the kettle can actually hold a temperature. */
  waterTempC: 93,
  /** Half a range, for reading a method's default window at its middle. */
  midpointDivisor: 2,
} as const;

/**
 * Which method to propose when somebody owns several.
 *
 * A pour over first: it is the method where a change in grind or temperature
 * shows up most clearly in the cup, which is exactly what makes it worth
 * calibrating on. Espresso is last, because a first shot says more about the
 * machine than about the person drinking it.
 */
export const CALIBRATION_METHOD_PREFERENCE: readonly BrewMethodCategory[] = [
  BREW_METHOD_CATEGORIES.pourOver,
  BREW_METHOD_CATEGORIES.immersion,
  BREW_METHOD_CATEGORIES.batch,
  BREW_METHOD_CATEGORIES.stovetop,
  BREW_METHOD_CATEGORIES.cold,
  BREW_METHOD_CATEGORIES.espresso,
];

/**
 * How much a described cup counts before the source's own trust is applied.
 *
 * Under one on purpose: a free-text description read by a keyword lexicon is
 * good evidence about somebody's vocabulary and rough evidence about their
 * palate, and it should not move a profile as far as answering a question
 * outright does.
 */
export const CALIBRATION_EVENT_WEIGHT = 0.8;

/** Where the user stands in the calibration step. */
export const CALIBRATION_STAGES = {
  proposal: 'proposal',
  describe: 'describe',
  saved: 'saved',
} as const;

export type CalibrationStage = (typeof CALIBRATION_STAGES)[keyof typeof CALIBRATION_STAGES];
