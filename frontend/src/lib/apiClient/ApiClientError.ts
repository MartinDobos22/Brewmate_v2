import type { ErrorCode } from '@brewmate/shared';

import type { ApiClientErrorCode } from './apiClientErrorCodes';

/**
 * Every failure a caller can see, carrying a code it is allowed to branch on.
 *
 * `details` is whatever the API put in the error envelope beside the message -
 * unknown here on purpose, because the app must not branch on its shape
 * without validating it first. The one thing that reads it, the model
 * allowance notice, parses it against the shared schema and falls back to the
 * ordinary sentence when it does not match.
 */
export class ApiClientError extends Error {
  public readonly code: ErrorCode | ApiClientErrorCode;
  public readonly status: number | null;
  public readonly requestId: string | null;
  public readonly details: unknown;

  public constructor(
    code: ErrorCode | ApiClientErrorCode,
    message: string,
    status: number | null,
    requestId: string | null,
    details: unknown = null,
  ) {
    super(message);
    this.name = ApiClientError.name;
    this.code = code;
    this.status = status;
    this.requestId = requestId;
    this.details = details;
  }
}
