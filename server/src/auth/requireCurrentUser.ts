import type { User } from '@brewmate/shared';
import type { FastifyRequest } from 'fastify';

import { unauthorizedError } from '../errors/unauthorizedError.js';

/**
 * Reads the user placed on the request by the auth plugin.
 *
 * @throws AppError (401) when the route was reached without authentication.
 */
export const requireCurrentUser = (request: FastifyRequest): User => {
  if (request.currentUser === null) {
    throw unauthorizedError();
  }

  return request.currentUser;
};
