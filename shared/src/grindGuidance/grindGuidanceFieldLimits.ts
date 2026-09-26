/**
 * Every number the grind guidance leans on, written down once.
 *
 * The same discipline `conversionFieldLimits` follows, for the same reason:
 * this is arithmetic that decides what somebody dials into a grinder before
 * they have tasted anything, and an algorithm whose constants are scattered
 * across five files is one nobody can replace with confidence.
 *
 * Almost everything here is a *fraction of the brewing family's own window*
 * rather than a figure in microns, and that is the central decision. An
 * espresso window is two hundred microns wide and a cold brew window is four
 * hundred; "a notch coarser for a dark roast" has to mean the same amount of
 * taste in both, and a fixed micron shift would be a nudge on one and a
 * different drink on the other.
 */

/** Half a window, which is what a shift of 1.0 would move a grind by. */
export const WINDOW_HALF_WIDTH_FRACTION = 0.5;

/**
 * How far from the middle of the family window the bean facts may push a
 * starting point.
 *
 * Capped below one, so a light anaerobic that has been open two days never
 * starts outside the range the method is actually brewed in. The bean decides
 * where in the window to start; it does not get to leave it.
 */
export const BEAN_SHIFT_LIMIT = 0.8;

/**
 * How far this person's own history may move a starting point, on top of what
 * the bag moved it.
 *
 * Kept apart from the bean's own allowance rather than sharing it, because the
 * two are different evidence and neither should be able to crowd the other
 * out: a dark roast still starts coarser for somebody who habitually grinds
 * fine. Capped a little under the bean's allowance, because a habit is read
 * off a handful of cups made with one grinder and one kettle, and the curve it
 * is measured against was itself only ever an estimate.
 */
export const HABIT_SHIFT_LIMIT = 0.6;

/**
 * How wide the band around the starting point is, as a fraction of the
 * window's half-width.
 *
 * A band rather than a number, because a starting point is not an answer: it
 * is where to put the collar before the first cup, and the band is the range
 * the right setting is almost certainly inside. Narrow enough to be an
 * instruction, wide enough not to pretend it was measured.
 */
export const GUIDANCE_BAND_FRACTION = 0.35;

/**
 * How much of a brewing family's window one adjustment should move the grind.
 *
 * This is the number the whole dial-in rests on. Move less and the next cup
 * tastes the same, so nothing was learned and a dose was spent; move more and
 * the cup overshoots into the opposite fault, which is how a dial-in turns
 * into a bag down the sink. A sixth of the window is roughly the smallest
 * change that reliably tastes different.
 */
export const TASTE_STEP_FRACTION = 0.17;

/** Enough of the band to read a slope off; less than this is rounding noise. */
export const SLOPE_MIN_SETTING_SPAN = 0.1;

/** Collar settings are read to a tenth, exactly as a converted grind is. */
export const GUIDANCE_SETTING_DECIMALS = 1;

/** Particle sizes are whole microns. The digit after that is a pretence. */
export const GUIDANCE_MICRON_DECIMALS = 0;

/** A stepless collar records its step as zero and is advised in whole units. */
export const STEPLESS_ADVICE_UNIT = 1;

/**
 * Milliseconds in a day, for turning a roast date into an age.
 *
 * Written down here rather than imported, because this package sits under both
 * the API and the app and may not reach into either one's constants.
 */
export const MILLISECONDS_PER_DAY = 86400000;
