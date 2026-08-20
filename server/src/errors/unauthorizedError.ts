import { ERROR_CODES } from '@brewmate/shared';

import { HTTP_STATUS } from '../constants/httpStatus.js';

import { AppError } from './appError.js';
import { ERROR_MESSAGES } from './errorMessages.js';

export const unauthorizedError = (
  message: string = ERROR_MESSAGES.invalidIdToken,
  cause?: unknown,
): AppError =>
  new AppError({
    code: ERROR_CODES.unauthorized,
    statusCode: HTTP_STATUS.unauthorized,
    message,
    cause,
  });
