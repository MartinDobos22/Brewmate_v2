import { AUTH_HEADER_SEPARATOR, AUTH_SCHEME_BEARER, HTTP_HEADERS } from '@brewmate/shared';

import type { VerifiedToken } from '../../src/auth/verifiedToken.js';

import { createTestIdToken } from './testIdToken.js';

/** Builds the Authorization header for a test identity. */
export const authorizationHeaderFor = (token: VerifiedToken): Record<string, string> => ({
  [HTTP_HEADERS.authorization]: [AUTH_SCHEME_BEARER, createTestIdToken(token)].join(
    AUTH_HEADER_SEPARATOR,
  ),
});
