import { ERROR_CODES } from '@brewmate/shared';
import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from 'fastify-type-provider-zod';

import { HTTP_STATUS } from '../constants/httpStatus.js';
import { LOG_MESSAGES } from '../logging/logMessages.js';

import { isAppError } from './appError.js';
import { ERROR_MESSAGES } from './errorMessages.js';
import { isClientError } from './isClientError.js';
import { statusToErrorCode } from './statusToErrorCode.js';
import { toErrorResponse } from './toErrorResponse.js';

/**
 * Turns every failure - validation, application, framework or unknown - into
 * the one error envelope declared in @brewmate/shared.
 */
export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
): FastifyReply => {
  const requestId = request.id;

  if (hasZodFastifySchemaValidationErrors(error)) {
    request.log.warn({ err: error }, LOG_MESSAGES.requestFailed);

    return reply
      .status(HTTP_STATUS.unprocessableEntity)
      .send(
        toErrorResponse(
          ERROR_CODES.validationFailed,
          ERROR_MESSAGES.validationFailed,
          requestId,
          error.validation,
        ),
      );
  }

  if (isResponseSerializationError(error)) {
    request.log.error({ err: error }, LOG_MESSAGES.unhandledError);

    return reply
      .status(HTTP_STATUS.internalServerError)
      .send(
        toErrorResponse(
          ERROR_CODES.internalError,
          ERROR_MESSAGES.responseContractViolation,
          requestId,
        ),
      );
  }

  if (isAppError(error)) {
    const logPayload = { err: error, code: error.code };

    if (isClientError(error.statusCode)) {
      request.log.warn(logPayload, LOG_MESSAGES.requestFailed);
    } else {
      request.log.error(logPayload, LOG_MESSAGES.unhandledError);
    }

    return reply
      .status(error.statusCode)
      .send(toErrorResponse(error.code, error.message, requestId, error.details));
  }

  const statusCode = error.statusCode ?? HTTP_STATUS.internalServerError;

  if (isClientError(statusCode)) {
    request.log.warn({ err: error }, LOG_MESSAGES.requestFailed);

    return reply
      .status(statusCode)
      .send(toErrorResponse(statusToErrorCode(statusCode), error.message, requestId));
  }

  request.log.error({ err: error }, LOG_MESSAGES.unhandledError);

  return reply
    .status(HTTP_STATUS.internalServerError)
    .send(toErrorResponse(ERROR_CODES.internalError, ERROR_MESSAGES.internalError, requestId));
};
