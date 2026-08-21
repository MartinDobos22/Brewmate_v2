/**
 * The Firebase Authentication error codes the app recognises. Anything not
 * listed here becomes the generic Slovak message - the user never sees a code.
 */
export const FIREBASE_AUTH_ERROR_CODES = {
  invalidEmail: 'auth/invalid-email',
  missingPassword: 'auth/missing-password',
  invalidCredential: 'auth/invalid-credential',
  wrongPassword: 'auth/wrong-password',
  userNotFound: 'auth/user-not-found',
  emailAlreadyInUse: 'auth/email-already-in-use',
  weakPassword: 'auth/weak-password',
  userDisabled: 'auth/user-disabled',
  tooManyRequests: 'auth/too-many-requests',
  networkRequestFailed: 'auth/network-request-failed',
  requiresRecentLogin: 'auth/requires-recent-login',
  accountExistsWithDifferentCredential: 'auth/account-exists-with-different-credential',
} as const;

/** Rejection code Apple's sheet uses when the user backs out. Not an error. */
export const APPLE_CANCELLED_ERROR_CODE = 'ERR_REQUEST_CANCELED';

/** The query parameter Google returns the ID token in. */
export const GOOGLE_ID_TOKEN_PARAM = 'id_token';

/** Outcomes of an expo-auth-session prompt the app reacts to. */
export const AUTH_SESSION_RESULTS = {
  success: 'success',
  error: 'error',
} as const;
