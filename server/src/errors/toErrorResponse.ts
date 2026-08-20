import type { ErrorCode, ErrorResponse } from '@brewmate/shared';

/** Builds the single error envelope every failing response uses. */
export const toErrorResponse = (
  code: ErrorCode,
  message: string,
  requestId: string,
  details: unknown = null,
): ErrorResponse => ({
  error: { code, message, details },
  requestId,
});
