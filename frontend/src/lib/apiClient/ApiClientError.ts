import type { ErrorCode } from '@brewmate/shared';

import type { ApiClientErrorCode } from './apiClientErrorCodes';

/** Every failure a caller can see, carrying a code it is allowed to branch on. */
export class ApiClientError extends Error {
  public readonly code: ErrorCode | ApiClientErrorCode;
  public readonly status: number | null;
  public readonly requestId: string | null;

  public constructor(
    code: ErrorCode | ApiClientErrorCode,
    message: string,
    status: number | null,
    requestId: string | null,
  ) {
    super(message);
    this.name = ApiClientError.name;
    this.code = code;
    this.status = status;
    this.requestId = requestId;
  }
}
