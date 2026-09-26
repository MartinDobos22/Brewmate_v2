/**
 * How many of somebody's most recent cups the brewing profile reads.
 *
 * Two hundred is half a year of a cup a day, which is long enough for every
 * brewer somebody actually uses to have a habit and short enough that a new
 * kettle or a new grinder is outvoted within a couple of months rather than
 * dragged against forever. It is also a bound on the one query that reads it,
 * which runs before every recipe.
 */
export const BREWING_PROFILE_CUP_LIMIT = 200;
