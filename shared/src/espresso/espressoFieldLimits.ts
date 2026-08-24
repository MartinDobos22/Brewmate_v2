/**
 * The bounds a shot is read against while a coffee is being dialled in.
 *
 * These are not rules about what a good espresso is - people pull ristretti at
 * eighteen seconds and turbo shots at fifteen on purpose. They are the window
 * the *timeline* measures progress against, so that "this shot moved towards
 * where we were aiming" is a statement about something rather than a mood.
 */

/** The shot time a dial-in aims at unless the recipe says otherwise. */
export const DIAL_IN_TARGET_SECONDS_MIN = 25;
export const DIAL_IN_TARGET_SECONDS_MAX = 32;

/** A shot has to have run for at least this long to be worth reading anything into. */
export const SHOT_SECONDS_MIN = 1;
export const SHOT_SECONDS_MAX = 120;

/** What can plausibly end up in a cup from one basket. */
export const SHOT_YIELD_GRAMS_MIN = 1;
export const SHOT_YIELD_GRAMS_MAX = 200;

/**
 * How many earlier shots travel with a dial-in question.
 *
 * Eight, which is more than a dial-in should ever need and enough to show a
 * direction that reversed. The whole point of the mode is to need fewer shots
 * than that, and a model that cannot see the run cannot say "we have been here
 * before, go the other way".
 */
export const DIAL_IN_HISTORY_SHOTS = 8;
