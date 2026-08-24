import { TRANSLATION_KEYS, type TranslationKey } from '../../i18n';
import { ApiClientError } from '../apiClient';
import type { InterpolationValues } from '../text';

import { REQUEST_ERROR_KEYS } from './requestErrorKeys';
import { resolveAiLimitNotice } from './resolveAiLimitNotice';

export interface RequestErrorKeys {
  readonly titleKey: TranslationKey;
  readonly bodyKey: TranslationKey;
  /** Fills the holes in the sentence, where it has any. */
  readonly bodyValues?: InterpolationValues;
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

  /**
   * The model allowance is the one failure with something specific to say:
   * which ceiling, when it lifts, and what still works. It is checked before
   * the general mapping because that one would answer with "príliš veľa
   * pokusov", which reads as an accusation and leaves nothing to do.
   */
  const limit = resolveAiLimitNotice(error);

  if (limit !== null) {
    return limit;
  }

  return {
    titleKey: TRANSLATION_KEYS.stateErrorTitle,
    bodyKey:
      error instanceof ApiClientError
        ? REQUEST_ERROR_KEYS[error.code]
        : TRANSLATION_KEYS.errorUnknown,
  };
};
