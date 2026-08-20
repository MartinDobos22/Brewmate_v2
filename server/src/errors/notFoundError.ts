import { ERROR_CODES } from '@brewmate/shared';

import { HTTP_STATUS } from '../constants/httpStatus.js';

import { AppError } from './appError.js';
import { ERROR_MESSAGES } from './errorMessages.js';

export const notFoundError = (message: string = ERROR_MESSAGES.routeNotFound): AppError =>
  new AppError({
    code: ERROR_CODES.notFound,
    statusCode: HTTP_STATUS.notFound,
    message,
  });
