import { ERROR_CODES } from '@brewmate/shared';
import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from 'fastify-type-provider-zod';

import { HTTP_STATUS } from '../constants/httpStatus.js';
import { LOG_MESSAGES } from '../logging/logMessages.js';
import type { ErrorContext, ErrorTracker } from '../telemetry/errorTracker.js';

import { isAppError } from './appError.js';
import { ERROR_MESSAGES } from './errorMessages.js';
import { isClientError } from './isClientError.js';
import { statusToErrorCode } from './statusToErrorCode.js';
import { toErrorResponse } from './toErrorResponse.js';

/**
 * What a report is allowed to carry.
 *
 * The route pattern rather than the URL, so an id in a path never leaves the
 * building; the internal account id rather than an email; and nothing at all
 * from the body or the query string. `redactPaths` already decides what may be
 * logged, and a reporter that quietly sent more than the log does would make
 * that decision meaningless.
 */
const toErrorContext = (request: FastifyRequest, statusCode: number): ErrorContext => ({
  userId: request.currentUser?.id,
  requestId: request.id,
  route: request.routeOptions.url,
  method: request.method,
  statusCode,
});

/**
 * Turns every failure - validation, application, framework or unknown - into
 * the one error envelope declared in @brewmate/shared.
 *
 * A factory rather than a bare function, because the reporter is injected: an
 * integration test can assert that a 500 was reported without a third party
 * being involved, and a deployment with no DSN gets the one that does nothing.
 *
 * Only failures nobody expected are reported. A 404 for a coffee that is not
 * there, a 422 for a malformed body and a 429 for an account at its ceiling
 * are all the API working exactly as designed; sending those to an alerting
 * tool is how a team learns to ignore it. What goes out is what the log also
 * calls an unhandled error: a broken response contract, an application error
 * that is not the caller's fault, and anything that reached here without being
 * recognised at all.
 */
export const createErrorHandler =
  (errorTracker: ErrorTracker) =>
  (error: FastifyError, request: FastifyRequest, reply: FastifyReply): FastifyReply => {
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
      errorTracker.capture(error, toErrorContext(request, HTTP_STATUS.internalServerError));

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
        errorTracker.capture(error, toErrorContext(request, error.statusCode));
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
    errorTracker.capture(error, toErrorContext(request, HTTP_STATUS.internalServerError));

    return reply
      .status(HTTP_STATUS.internalServerError)
      .send(toErrorResponse(ERROR_CODES.internalError, ERROR_MESSAGES.internalError, requestId));
  };
