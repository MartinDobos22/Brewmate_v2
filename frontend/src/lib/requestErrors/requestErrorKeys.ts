import { ERROR_CODES, type ErrorCode } from '@brewmate/shared';

import { TRANSLATION_KEYS, type TranslationKey } from '../../i18n';
import { API_CLIENT_ERROR_CODES, type ApiClientErrorCode } from '../apiClient';

/**
 * One Slovak sentence per failure the app can meet.
 *
 * The map is total over both code sets, so a new error code is a type error
 * here rather than a raw `CONFLICT` on somebody's screen.
 */
export const REQUEST_ERROR_KEYS: Record<ErrorCode | ApiClientErrorCode, TranslationKey> = {
  [ERROR_CODES.badRequest]: TRANSLATION_KEYS.errorBadRequest,
  [ERROR_CODES.validationFailed]: TRANSLATION_KEYS.errorValidation,
  [ERROR_CODES.unauthorized]: TRANSLATION_KEYS.errorUnauthorized,
  [ERROR_CODES.forbidden]: TRANSLATION_KEYS.errorForbidden,
  [ERROR_CODES.notFound]: TRANSLATION_KEYS.errorNotFound,
  [ERROR_CODES.conflict]: TRANSLATION_KEYS.errorConflict,
  [ERROR_CODES.tooManyRequests]: TRANSLATION_KEYS.errorTooManyRequests,
  [ERROR_CODES.internalError]: TRANSLATION_KEYS.errorInternal,
  [ERROR_CODES.serviceUnavailable]: TRANSLATION_KEYS.errorUnavailable,
  [API_CLIENT_ERROR_CODES.network]: TRANSLATION_KEYS.errorNetwork,
  [API_CLIENT_ERROR_CODES.timeout]: TRANSLATION_KEYS.errorTimeout,
  [API_CLIENT_ERROR_CODES.invalidResponse]: TRANSLATION_KEYS.errorInvalidResponse,
};
