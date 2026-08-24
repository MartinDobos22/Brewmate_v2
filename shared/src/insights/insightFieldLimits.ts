/**
 * What the history is allowed to claim, and when it is allowed to claim it.
 *
 * These live in the contract rather than on the server because the app prints
 * the same thresholds back at the reader - "uvar ešte tri kávy a poviem ti
 * viac" is a promise, and a promise the API does not keep is worse than
 * saying nothing.
 */

/** Below this many brews the report says so instead of ranking three cups. */
export const INSIGHT_MIN_BREWS = 5;

/** How many values of one attribute are worth printing. */
export const INSIGHT_VALUES_PER_ATTRIBUTE_MAX = 5;

export const INSIGHT_VALUE_MAX_LENGTH = 120;
export const INSIGHT_EXPLANATION_MAX_LENGTH = 600;
export const INSIGHT_REASONS_MAX = 6;

/**
 * What it takes before the app proposes moving somebody's profile.
 *
 * A suggestion is an interruption, so it has to be earned: enough cups for the
 * pattern to be real, and a clear enough majority that it is a pattern rather
 * than a coincidence between two roast levels.
 */
export const SUGGESTION_MIN_BREWS = 6;
export const SUGGESTION_MIN_SHARE = 0.6;

/**
 * How far one accepted suggestion may move a flavour affinity.
 *
 * Small on purpose. This is a conclusion drawn from what somebody reached for,
 * not something they said - it deserves a nudge, not a rewrite.
 */
export const SUGGESTION_AFFINITY_STEP = 0.4;

/** Bounds on the fingerprint that makes accepting the same advice twice safe. */
export const SUGGESTION_REF_MAX_LENGTH = 128;
