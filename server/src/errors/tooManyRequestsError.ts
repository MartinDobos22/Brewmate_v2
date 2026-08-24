import { ERROR_CODES, type AiRateLimitDetails } from '@brewmate/shared';

import { HTTP_STATUS } from '../constants/httpStatus.js';

import { AppError } from './appError.js';
import { ERROR_MESSAGES } from './errorMessages.js';

/**
 * The caller has used up an allowance, and will get it back.
 *
 * The details travel with it rather than being folded into the message,
 * because the app has to write a sentence somebody can act on: which ceiling,
 * over which window, and when it lifts. "Skús to neskôr" is not an answer;
 * "o 40 minút" is. A message written for a log cannot be parsed back into
 * either.
 */
export const tooManyRequestsError = (
  message: string = ERROR_MESSAGES.badRequest,
  details?: AiRateLimitDetails,
): AppError =>
  new AppError({
    code: ERROR_CODES.tooManyRequests,
    statusCode: HTTP_STATUS.tooManyRequests,
    message,
    details,
  });
