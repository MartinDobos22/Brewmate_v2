import { ERROR_CODES } from '@brewmate/shared';

import { HTTP_STATUS } from '../constants/httpStatus.js';

import { AppError } from './appError.js';
import { ERROR_MESSAGES } from './errorMessages.js';

export const badRequestError = (
  message: string = ERROR_MESSAGES.badRequest,
  details?: unknown,
): AppError =>
  new AppError({
    code: ERROR_CODES.badRequest,
    statusCode: HTTP_STATUS.badRequest,
    message,
    details,
  });
