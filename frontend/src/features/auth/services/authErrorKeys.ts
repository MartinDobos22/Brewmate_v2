import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';
import { API_CLIENT_ERROR_CODES } from '../../../lib/apiClient';
import { FIREBASE_AUTH_ERROR_CODES } from '../constants/firebaseAuthErrorCodes';

/**
 * Firebase error code -> Slovak sentence. The user is told what happened and
 * what to do about it; the code itself never reaches the screen.
 *
 * `invalid-credential` covers a wrong password and an unknown e-mail alike -
 * newer Firebase projects collapse the two on purpose, so that an attacker
 * cannot use the error to find out which addresses have accounts.
 */
export const AUTH_ERROR_KEYS: Readonly<Record<string, TranslationKey>> = {
  [FIREBASE_AUTH_ERROR_CODES.invalidEmail]: TRANSLATION_KEYS.authErrorEmailInvalid,
  [FIREBASE_AUTH_ERROR_CODES.missingPassword]: TRANSLATION_KEYS.authErrorPasswordRequired,
  [FIREBASE_AUTH_ERROR_CODES.invalidCredential]: TRANSLATION_KEYS.authErrorInvalidCredentials,
  [FIREBASE_AUTH_ERROR_CODES.wrongPassword]: TRANSLATION_KEYS.authErrorInvalidCredentials,
  [FIREBASE_AUTH_ERROR_CODES.userNotFound]: TRANSLATION_KEYS.authErrorInvalidCredentials,
  [FIREBASE_AUTH_ERROR_CODES.emailAlreadyInUse]: TRANSLATION_KEYS.authErrorEmailInUse,
  [FIREBASE_AUTH_ERROR_CODES.weakPassword]: TRANSLATION_KEYS.authErrorWeakPassword,
  [FIREBASE_AUTH_ERROR_CODES.userDisabled]: TRANSLATION_KEYS.authErrorUserDisabled,
  [FIREBASE_AUTH_ERROR_CODES.tooManyRequests]: TRANSLATION_KEYS.authErrorTooManyAttempts,
  [FIREBASE_AUTH_ERROR_CODES.networkRequestFailed]: TRANSLATION_KEYS.authErrorNetwork,
  [FIREBASE_AUTH_ERROR_CODES.requiresRecentLogin]: TRANSLATION_KEYS.authErrorRecentLoginRequired,
  [FIREBASE_AUTH_ERROR_CODES.accountExistsWithDifferentCredential]:
    TRANSLATION_KEYS.authErrorAccountExistsWithOtherProvider,
};

/** Transport failures of the Brewmate API, which carry their own codes. */
export const API_ERROR_KEYS: Readonly<Record<string, TranslationKey>> = {
  [API_CLIENT_ERROR_CODES.network]: TRANSLATION_KEYS.authErrorNetwork,
  [API_CLIENT_ERROR_CODES.timeout]: TRANSLATION_KEYS.authErrorNetwork,
};
