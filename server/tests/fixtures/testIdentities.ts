import type { VerifiedToken } from '../../src/auth/verifiedToken.js';

/** Stable identities used across the integration tests. */
export const RETURNING_IDENTITY: VerifiedToken = {
  firebaseUid: 'firebase-uid-returning-user',
  email: 'returning@brewmate.test',
};

export const ANONYMOUS_IDENTITY: VerifiedToken = {
  firebaseUid: 'firebase-uid-without-email',
  email: null,
};

export const SECOND_IDENTITY: VerifiedToken = {
  firebaseUid: 'firebase-uid-second-user',
  email: 'second@brewmate.test',
};

export const NEW_DISPLAY_NAME = 'Barista Ada';
export const TOO_SHORT_DISPLAY_NAME = 'A';
export const UNKNOWN_FIELD_NAME = 'role';
export const UNKNOWN_FIELD_VALUE = 'admin';
export const FORGED_ID_TOKEN = 'not-a-real-token';
