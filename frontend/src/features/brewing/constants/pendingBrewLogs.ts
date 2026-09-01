import { ERROR_CODES, type ErrorCode } from '@brewmate/shared';

/**
 * The refusals a queued brew will never survive, however often it is offered.
 *
 * Everything else - no connection, a timeout, a 5xx, an expired token, a spent
 * allowance - is a reason to try the same brew again later, so it stays in the
 * queue. These four are the server saying the request itself is wrong: a body
 * it will not accept, or a recipe that has since been deleted. Keeping one of
 * those would block every brew queued behind it forever, which is the one way
 * a queue built to lose nothing can end up delivering nothing.
 */
export const PERMANENTLY_REJECTED_BREW_LOG_CODES: readonly ErrorCode[] = [
  ERROR_CODES.badRequest,
  ERROR_CODES.validationFailed,
  ERROR_CODES.notFound,
  ERROR_CODES.conflict,
];
