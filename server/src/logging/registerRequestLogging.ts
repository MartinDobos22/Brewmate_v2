import { API_ROUTES } from '@brewmate/shared';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { HTTP_STATUS } from '../constants/httpStatus.js';
import { isClientError } from '../errors/isClientError.js';

import { LOG_MESSAGES } from './logMessages.js';

/**
 * One line per request, written when the response has gone out.
 *
 * Fastify's own request logging writes two records per request - "incoming
 * request" and "request completed" - and only the first carries the path, so
 * the line with the status and the duration never said what it was about. This
 * replaces both with `GET /taste-profile -> 200 (35 ms)`, plus who asked.
 *
 * The level follows the outcome, so a filter on warnings is a list of what went
 * wrong: a 4xx is a warning, a 5xx an error, anything else information. The
 * health probe is logged at debug - the host calls it every few seconds, and at
 * information level it buried every real request under its own.
 */
const logResponse = (request: FastifyRequest, reply: FastifyReply): void => {
  const { method, url } = request;
  const { statusCode } = reply;
  const durationMs = Math.round(reply.elapsedTime);
  const payload = {
    http: { method, url, statusCode, durationMs },
    userId: request.currentUser?.id,
  };
  const message = LOG_MESSAGES.requestCompleted(method, url, statusCode, durationMs);

  if (statusCode >= HTTP_STATUS.internalServerError) {
    request.log.error(payload, message);
  } else if (isClientError(statusCode)) {
    request.log.warn(payload, message);
  } else if (request.routeOptions.url === API_ROUTES.health) {
    request.log.debug(payload, message);
  } else {
    request.log.info(payload, message);
  }
};

export const registerRequestLogging = (app: FastifyInstance): void => {
  app.addHook('onResponse', (request, reply, done) => {
    logResponse(request, reply);
    done();
  });
};
