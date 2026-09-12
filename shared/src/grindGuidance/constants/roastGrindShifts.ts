import { ROAST_LEVELS, type RoastLevel } from '../../enums/roastLevels.js';

/**
 * Where in its window a roast level wants to be ground, as a fraction of the
 * window's half-width. Positive is coarser.
 *
 * Solubility is the whole of the reasoning. A dark roast is brittle and gives
 * up its solubles readily, so the same time and temperature extract more out
 * of it - and the way to take that back is a coarser grind. A light roast is
 * dense and resists, and wants the opposite. Medium is the middle of the
 * window by definition, which is what makes the table symmetrical rather than
 * a set of five separately argued numbers.
 *
 * Half a half-width at each end rather than the whole of it: a dark roast in a
 * V60 is still a V60 grind, and a table that pushed it to the coarse edge of
 * the window would leave nowhere for the processing and the age of the coffee
 * to say anything.
 */
export const ROAST_GRIND_SHIFTS: Record<RoastLevel, number> = {
  [ROAST_LEVELS.light]: -0.5,
  [ROAST_LEVELS.mediumLight]: -0.25,
  [ROAST_LEVELS.medium]: 0,
  [ROAST_LEVELS.mediumDark]: 0.25,
  [ROAST_LEVELS.dark]: 0.5,
};
