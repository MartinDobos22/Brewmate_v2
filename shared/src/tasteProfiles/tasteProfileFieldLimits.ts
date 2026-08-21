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
