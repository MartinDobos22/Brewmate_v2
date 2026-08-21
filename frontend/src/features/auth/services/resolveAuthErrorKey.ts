import { FirebaseError } from 'firebase/app';

import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';
import { ApiClientError } from '../../../lib/apiClient';

import { API_ERROR_KEYS, AUTH_ERROR_KEYS } from './authErrorKeys';

/**
 * Turns anything a sign-in attempt can throw into one Slovak sentence.
 *
 * This is the only place that reads a provider error code, which is what keeps
 * `auth/invalid-credential` out of the interface.
 */
export const resolveAuthErrorKey = (
  error: unknown,
  fallbackKey: TranslationKey = TRANSLATION_KEYS.authErrorUnknown,
): TranslationKey => {
  if (error instanceof FirebaseError) {
    return AUTH_ERROR_KEYS[error.code] ?? fallbackKey;
  }

  if (error instanceof ApiClientError) {
    return API_ERROR_KEYS[error.code] ?? fallbackKey;
  }

  return fallbackKey;
};
