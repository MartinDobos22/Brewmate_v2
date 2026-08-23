import { TRANSLATION_KEYS, type TranslationKey } from '../../i18n';
import { ApiClientError } from '../apiClient';

import { REQUEST_ERROR_KEYS } from './requestErrorKeys';

export interface RequestErrorKeys {
  readonly titleKey: TranslationKey;
  readonly bodyKey: TranslationKey;
}

/**
 * What to print when a request failed.
 *
 * Being offline outranks whatever code came back: a request that never left
 * the phone failed for a reason the user can see out of the window, and
 * telling them the server had a problem would send them looking in the wrong
 * place. Anything else falls back to the unknown sentence rather than to the
 * error's own message, which is written for a log, not for a person.
 */
export const resolveRequestErrorKeys = (error: unknown, isOnline: boolean): RequestErrorKeys => {
  if (!isOnline) {
    return {
      titleKey: TRANSLATION_KEYS.errorOfflineTitle,
      bodyKey: TRANSLATION_KEYS.errorOfflineBody,
    };
  }

  return {
    titleKey: TRANSLATION_KEYS.stateErrorTitle,
    bodyKey:
      error instanceof ApiClientError
        ? REQUEST_ERROR_KEYS[error.code]
        : TRANSLATION_KEYS.errorUnknown,
  };
};
