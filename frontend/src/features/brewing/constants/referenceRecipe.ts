import { ROAST_LEVELS, type RoastLevel } from '@brewmate/shared';

/**
 * The reference brew - the cup Brewmate proposes when it has nothing better to
 * go on: the first calibration cup, and every quick brew.
 *
 * Deliberately unremarkable numbers. The point of this cup is not to be the
 * best coffee somebody has made, it is to be a cup Brewmate knows the recipe
 * for, so that whatever the drinker says about it can be read as a difference
 * from a known starting point.
 */
export const REFERENCE_RECIPE = {
  doseGrams: 15,
  espressoDoseGrams: 18,
  waterTempC: 93,
  /** Half a range, for reading a method's default window at its middle. */
  midpointDivisor: 2,
} as const;

/**
 * How the water temperature moves with the roast, in degrees.
 *
 * The one thing a drinker reliably knows about a bag they have not written
 * down anywhere - "svetlé" or "tmavé" on the label - and the one adjustment
 * worth making from it: a light roast gives up very little below boiling, a
 * dark one turns harsh at the same temperature.
 *
 * Only ever applied when the kettle can hold a temperature at all. Everything
 * else about an undeclared coffee stays at the reference, because a guess
 * dressed up as a tailored recipe is worse than an honest default.
 */
export const ROAST_TEMPERATURE_OFFSET_C: Record<RoastLevel, number> = {
  [ROAST_LEVELS.light]: 3,
  [ROAST_LEVELS.mediumLight]: 1,
  [ROAST_LEVELS.medium]: 0,
  [ROAST_LEVELS.mediumDark]: -2,
  [ROAST_LEVELS.dark]: -4,
};
