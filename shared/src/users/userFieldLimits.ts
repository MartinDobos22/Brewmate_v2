/**
 * Validation bounds for user fields. Referenced by both the API and the app,
 * so a limit is never restated as a literal anywhere else.
 */
export const FIREBASE_UID_MIN_LENGTH = 8;
export const FIREBASE_UID_MAX_LENGTH = 128;
export const DISPLAY_NAME_MIN_LENGTH = 2;
export const DISPLAY_NAME_MAX_LENGTH = 64;
export const EMAIL_MAX_LENGTH = 320;

/**
 * Six is the shortest password Firebase Authentication accepts. The app
 * refuses anything shorter before the request is made, so the user sees a
 * Slovak sentence instead of a raw provider error.
 */
export const PASSWORD_MIN_LENGTH = 6;

/** Bounds for the onboarding state blob. */
export const ONBOARDING_STEP_MAX_LENGTH = 64;
export const ONBOARDING_VERSION_MIN = 1;

/** The id of a tapped questionnaire option, as stored against its question. */
export const ONBOARDING_ANSWER_MAX_LENGTH = 64;
