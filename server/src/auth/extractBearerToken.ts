import { AUTH_HEADER_SEPARATOR, AUTH_SCHEME_BEARER } from '@brewmate/shared';

import { ERROR_MESSAGES } from '../errors/errorMessages.js';
import { unauthorizedError } from '../errors/unauthorizedError.js';

const EMPTY_STRING = '';

/**
 * Pulls the credentials out of an `Authorization: Bearer <token>` header.
 *
 * @throws AppError (401) when the header is absent or does not use the Bearer scheme.
 */
export const extractBearerToken = (headerValue: string | undefined): string => {
  if (headerValue === undefined || headerValue.trim() === EMPTY_STRING) {
    throw unauthorizedError(ERROR_MESSAGES.missingAuthorizationHeader);
  }

  const [scheme, ...credentials] = headerValue.trim().split(AUTH_HEADER_SEPARATOR);
  const token = credentials.join(AUTH_HEADER_SEPARATOR).trim();

  if (scheme !== AUTH_SCHEME_BEARER || token === EMPTY_STRING) {
    throw unauthorizedError(ERROR_MESSAGES.malformedAuthorizationHeader);
  }

  return token;
};
