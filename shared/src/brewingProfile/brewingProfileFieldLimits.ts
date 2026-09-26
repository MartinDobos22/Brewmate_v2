import {
  TASTE_STEP_FRACTION,
  WINDOW_HALF_WIDTH_FRACTION,
} from '../grindGuidance/grindGuidanceFieldLimits.js';

/**
 * Every number the brewing profile leans on, written down once.
 *
 * The same discipline the grind guidance follows: this is arithmetic that
 * decides what the form proposes and where the collar starts before anybody
 * has tasted anything, and constants scattered across the files that use them
 * are constants nobody can argue with.
 */

/**
 * How many cups a figure needs behind it before the profile will state it.
 *
 * Three, because one cup is an accident and two can be the same accident
 * twice; the third is the first point at which "this is what they do" is a
 * better guess than the method's own middle. Counted in cups rather than in
 * weight, so the rule is one a person could check by counting.
 */
export const BREWING_HABIT_MIN_CUPS = 3;

/**
 * How many different coffees a grind habit needs behind it.
 *
 * Two, because a grind is the one figure a single bag can explain on its own:
 * a coffee that simply wanted grinding finer than its label suggested would
 * otherwise become a habit of grinding everything finer. Dose, ratio and
 * temperature have no such trap - nobody weighs out more coffee because of
 * which bag it came out of.
 */
export const GRIND_HABIT_MIN_COFFEES = 2;

/**
 * What a cup still counts for once its recipe has been corrected and the
 * correction brewed.
 *
 * Less rather than nothing. The version somebody moved away from is evidence
 * of where they did not want to be, which is not the same as no evidence -
 * but the version they moved to is the one they kept brewing, and a median
 * over every cup would let a long dial-in outvote the recipe it arrived at.
 */
export const SUPERSEDED_CUP_WEIGHT = 0.3;

/**
 * How far a cup somebody called sour or bitter is moved, in the grind, to
 * where they would have wanted it - as a fraction of the window's half-width.
 *
 * One tasteable adjustment: the same move the guidance would advise after a
 * cup like that, so the lesson learned from a complaint and the advice given
 * in answer to it are the same size. Derived from the guidance's own constants
 * rather than written twice.
 */
export const READING_GRIND_CORRECTION = TASTE_STEP_FRACTION / WINDOW_HALF_WIDTH_FRACTION;

/** The same complaint read as a temperature, in degrees - a step anybody can taste. */
export const READING_TEMPERATURE_CORRECTION = 2;

/**
 * How far a cup called watery or heavy moves its ratio, as a share of the
 * ratio itself.
 *
 * A share rather than a number of parts, because a part of water is a nudge in
 * a 1:16 dripper and a different drink in a 1:2 espresso. About one part of a
 * filter ratio, about a tenth of an espresso one.
 */
export const READING_RATIO_CORRECTION = 0.06;

/**
 * What a cup somebody said was right counts for, against one nobody commented
 * on.
 *
 * "Presne takto" is the best evidence there is about where somebody wants to
 * be: every other cup is a number that happened, this one is a number that
 * was approved. Only for the figures the remark was about - a cup called
 * perfectly strong has said nothing about its grind.
 */
export const CONFIRMED_CUP_WEIGHT = 2;

/**
 * The smallest grind habit worth reporting, as a fraction of the window's
 * half-width.
 *
 * Under half of what one tasteable adjustment moves, so a habit that exists
 * only in the third decimal is reported as none: a starting point that shifted
 * by a tenth of a click and said "because of your cups" would be claiming a
 * lesson nobody could taste.
 */
export const GRIND_HABIT_NOTICEABLE = 0.15;

/** A dose is proposed in the half grams the form moves in. */
export const HABIT_DOSE_STEP = 0.5;

/** A ratio is proposed in the half parts the slider moves in. */
export const HABIT_RATIO_STEP = 0.5;

/** A temperature is a whole degree; a tenth is a thermometer nobody owns. */
export const HABIT_TEMPERATURE_STEP = 1;

/** A habit shift is stated to two places, which is finer than any collar. */
export const HABIT_SHIFT_DECIMALS = 2;

/** How many methods a profile may describe - far more than anybody owns. */
export const BREWING_PROFILE_METHODS_MAX = 100;

/** How many grinder-and-family habits it may describe - likewise. */
export const BREWING_PROFILE_GRIND_HABITS_MAX = 100;
