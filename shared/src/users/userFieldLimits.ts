/**
 * Validation bounds for user fields. Referenced by both the API and the app,
 * so a limit is never restated as a literal anywhere else.
 */
export const FIREBASE_UID_MIN_LENGTH = 8;
export const FIREBASE_UID_MAX_LENGTH = 128;
export const DISPLAY_NAME_MIN_LENGTH = 2;
export const DISPLAY_NAME_MAX_LENGTH = 64;
export const EMAIL_MAX_LENGTH = 320;
