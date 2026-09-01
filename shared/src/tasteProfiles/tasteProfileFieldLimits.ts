/**
 * Bounds for the taste profile and its audit trail.
 * Both the reducer on the server and the sliders in the app read these.
 */
export const TASTE_AXIS_MIN = 0;
export const TASTE_AXIS_MAX = 10;

/** Neutral starting point for an account with no events yet. */
export const TASTE_AXIS_NEUTRAL = 5;

export const CONFIDENCE_MIN = 0;
export const CONFIDENCE_MAX = 1;

/** A flavour affinity runs from active dislike to active preference. */
export const FLAVOR_AFFINITY_MIN = -1;
export const FLAVOR_AFFINITY_MAX = 1;
export const FLAVOR_TAG_MAX_LENGTH = 48;

export const BREW_COUNT_MIN = 0;

/** Identifies the thing that produced an event, so it can only count once. */
export const SOURCE_REF_MAX_LENGTH = 128;
export const EVENT_NOTE_MAX_LENGTH = 500;

/**
 * What a *change* to an axis may be, which is not what an axis may be.
 *
 * A delta is the difference between two positions on the scale, so it runs the
 * whole width of that scale in both directions - and most of the time it is
 * negative, because half of everything anybody says about coffee asks for less
 * of something. Validating a difference against the bounds of a value refuses
 * every observation that lowers an axis, which is how a questionnaire whose
 * first answer was "nemám rád kyslé" came back as a 500.
 */
export const TASTE_AXIS_DELTA_MIN = TASTE_AXIS_MIN - TASTE_AXIS_MAX;
export const TASTE_AXIS_DELTA_MAX = TASTE_AXIS_MAX - TASTE_AXIS_MIN;

/** The same, for a flavour tag: from active dislike to active preference. */
export const FLAVOR_AFFINITY_DELTA_MIN = FLAVOR_AFFINITY_MIN - FLAVOR_AFFINITY_MAX;
export const FLAVOR_AFFINITY_DELTA_MAX = FLAVOR_AFFINITY_MAX - FLAVOR_AFFINITY_MIN;
