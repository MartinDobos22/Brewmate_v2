import { ERROR_CODES } from '@brewmate/shared';

import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';
import { ApiClientError } from '../../../lib/apiClient';

/**
 * Turns a failed contribution into a Slovak sentence.
 *
 * The one case worth naming is the conflict: the grinder is already in the
 * catalogue, which is good news phrased as an error, and telling somebody
 * "skús to znova" there would send them round the same loop forever.
 */
export const resolveGrinderErrorKey = (error: Error | null): TranslationKey | null => {
  if (error === null) {
    return null;
  }

  if (error instanceof ApiClientError && error.code === ERROR_CODES.conflict) {
    return TRANSLATION_KEYS.grinderErrorAlreadyCatalogued;
  }

  return TRANSLATION_KEYS.grinderErrorAddFailed;
};
