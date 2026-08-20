import { ERROR_CODES } from '@brewmate/shared';

import { HTTP_STATUS } from '../constants/httpStatus.js';

import { AppError } from './appError.js';
import { ERROR_MESSAGES } from './errorMessages.js';

export const internalError = (
  message: string = ERROR_MESSAGES.internalError,
  cause?: unknown,
): AppError =>
  new AppError({
    code: ERROR_CODES.internalError,
    statusCode: HTTP_STATUS.internalServerError,
    message,
    cause,
  });
