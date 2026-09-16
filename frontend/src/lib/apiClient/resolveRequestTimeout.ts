import { AI_ROUTE_PREFIX } from '@brewmate/shared';

import { LIMITS } from '../../constants/limits';

/**
 * How long this particular request may take, read off its path.
 *
 * A rule about the application rather than a decision each call site makes,
 * for the same reason the API puts its spending allowance in front of `/ai/*`
 * with one hook: "the routes that ask a model something" is one rule, and a
 * service that forgot to pass the longer timeout would be a screen that
 * abandons a paid call fifteen seconds in and says the server was late.
 */
export const resolveRequestTimeout = (path: string): number =>
  path.startsWith(AI_ROUTE_PREFIX) ? LIMITS.aiRequestTimeoutMs : LIMITS.requestTimeoutMs;
