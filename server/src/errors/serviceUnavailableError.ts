import { ERROR_CODES } from '@brewmate/shared';

import { HTTP_STATUS } from '../constants/httpStatus.js';

import { AppError } from './appError.js';
import { ERROR_MESSAGES } from './errorMessages.js';

/**
 * Something the API depends on is not answering right now.
 *
 * Distinct from an internal error on purpose: the caller did nothing wrong and
 * the same request may well work in a minute, which is exactly what the app
 * needs to know in order to offer "skús to znova" rather than "zadaj to ručne".
 */
export const serviceUnavailableError = (
  message: string = ERROR_MESSAGES.internalError,
  cause?: unknown,
): AppError =>
  new AppError({
    code: ERROR_CODES.serviceUnavailable,
    statusCode: HTTP_STATUS.serviceUnavailable,
    message,
    cause,
  });
