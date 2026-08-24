/**
 * Every number the conversion arithmetic leans on, written down once.
 *
 * This module is deliberately the only place in `conversion/` where a figure
 * appears at all: the whole point of keeping the conversion isolated is that a
 * better algorithm can replace the arithmetic without touching anything else,
 * and an algorithm whose constants are scattered through six files is one
 * nobody can replace with confidence.
 */

/**
 * How much of a brewer's stated capacity a brew may actually use.
 *
 * Not all of it: wet grounds take up room, a dripper overflows well before its
 * rim and a French press needs space above the plunger. Nine tenths is the
 * figure that keeps a scaled-up recipe from being a recipe that runs over the
 * side of somebody's brewer.
 */
export const BREWER_USABLE_CAPACITY_FRACTION = 0.9;

/** A millilitre of brewing water weighs a gram closely enough for a recipe. */
export const MILLILITRES_PER_GRAM = 1;

/**
 * How far apart two settings on one collar may be before the conversion
 * refuses to extrapolate from a curve rather than interpolate along it.
 *
 * A published curve describes the range it was measured over. Reading it a
 * long way past its last point produces a number that looks like an answer and
 * is not one, so the conversion says the grind is a guess instead.
 */
export const CALIBRATION_EXTRAPOLATION_LIMIT = 0.5;

/** A curve needs two points before anything can be read between them. */
export const CALIBRATION_POINTS_REQUIRED = 2;

/** Collar settings are read to a tenth; nobody dials a hundredth of a click. */
export const GRIND_SETTING_DECIMALS = 1;

/** Particle sizes are whole microns. The digit after that is a pretence. */
export const GRIND_MICRON_DECIMALS = 0;

/** Water temperature is a whole number of degrees on every kettle sold. */
export const WATER_TEMP_DECIMALS = 0;

/**
 * The micron windows each brewing family is normally ground into.
 *
 * Wide on purpose. These are the fallback for a recipe whose author never said
 * what they ground on - the answer they produce is a starting point that gets
 * dialled in, and a narrow window would dress a guess up as a measurement.
 */
export const ESPRESSO_MICRONS_MIN = 180;
export const ESPRESSO_MICRONS_MAX = 380;
export const POUR_OVER_MICRONS_MIN = 550;
export const POUR_OVER_MICRONS_MAX = 850;
export const IMMERSION_MICRONS_MIN = 700;
export const IMMERSION_MICRONS_MAX = 1000;
export const STOVETOP_MICRONS_MIN = 350;
export const STOVETOP_MICRONS_MAX = 550;
export const BATCH_MICRONS_MIN = 600;
export const BATCH_MICRONS_MAX = 900;
export const COLD_MICRONS_MIN = 900;
export const COLD_MICRONS_MAX = 1300;

/**
 * Where each spoken description of a grind sits, in microns.
 *
 * The bands are contiguous and they cover the whole usable range, because the
 * descriptor is also read backwards: a converted grind gets a word attached to
 * it whether or not the target grinder has a collar worth printing a number
 * from.
 */
export const EXTRA_FINE_MICRONS_MAX = 250;
export const FINE_MICRONS_MAX = 450;
export const MEDIUM_FINE_MICRONS_MAX = 650;
export const MEDIUM_MICRONS_MAX = 850;
export const MEDIUM_COARSE_MICRONS_MAX = 1050;

/**
 * The temperature each family is brewed at when the source recipe never said.
 *
 * Only used where the drinker can actually set one - a kettle with an on
 * switch gets no number at all, it gets a procedure.
 */
export const ESPRESSO_DEFAULT_TEMP_C = 93;
export const POUR_OVER_DEFAULT_TEMP_C = 94;
export const IMMERSION_DEFAULT_TEMP_C = 93;
export const STOVETOP_DEFAULT_TEMP_C = 96;
export const BATCH_DEFAULT_TEMP_C = 94;
export const COLD_DEFAULT_TEMP_C = 20;

/**
 * The dose each family starts from when the source recipe stated no amounts
 * at all, and the brewer has no dose window written down either.
 *
 * A recipe has to have a dose; this is the least surprising one for the method
 * rather than a claim about anything.
 */
export const ESPRESSO_DEFAULT_DOSE_GRAMS = 18;
export const POUR_OVER_DEFAULT_DOSE_GRAMS = 15;
export const IMMERSION_DEFAULT_DOSE_GRAMS = 15;
export const STOVETOP_DEFAULT_DOSE_GRAMS = 16;
export const BATCH_DEFAULT_DOSE_GRAMS = 60;
export const COLD_DEFAULT_DOSE_GRAMS = 60;

/** Scaling a pour schedule by less than this is not worth calling a change. */
export const SCALE_FACTOR_UNCHANGED = 1;

/** How much a scale factor may drift from one before it counts as scaling. */
export const SCALE_FACTOR_TOLERANCE = 0.005;

/** At most one note per field per reason; a report longer than this is noise. */
export const CONVERSION_NOTES_MAX = 24;

/** How much somebody may paste in from a video description or a blog post. */
export const SOURCE_RECIPE_TEXT_MAX_LENGTH = 4000;

/** What the source recipe was called where it came from. */
export const SOURCE_RECIPE_LABEL_MAX_LENGTH = 200;
