import { ERROR_CODES } from '@brewmate/shared';

import { HTTP_STATUS } from '../constants/httpStatus.js';

import { AppError } from './appError.js';
import { ERROR_MESSAGES } from './errorMessages.js';

/**
 * The request is valid but the current state refuses it - deleting a recipe
 * a brew log still points at, for instance.
 */
export const conflictError = (message: string = ERROR_MESSAGES.badRequest): AppError =>
  new AppError({
    code: ERROR_CODES.conflict,
    statusCode: HTTP_STATUS.conflict,
    message,
  });
