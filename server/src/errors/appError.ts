import type { ErrorCode } from '@brewmate/shared';

import type { HttpStatus } from '../constants/httpStatus.js';

interface AppErrorOptions {
  readonly code: ErrorCode;
  readonly statusCode: HttpStatus;
  readonly message: string;
  readonly details?: unknown;
  readonly cause?: unknown;
}

/**
 * An error the API knows how to present to a client.
 * Anything that is not an AppError is treated as an unexpected failure.
 */
export class AppError extends Error {
  public readonly code: ErrorCode;

  public readonly statusCode: HttpStatus;

  public readonly details: unknown;

  public constructor(options: AppErrorOptions) {
    super(options.message, { cause: options.cause });

    this.name = AppError.name;
    this.code = options.code;
    this.statusCode = options.statusCode;
    this.details = options.details ?? null;
  }
}

export const isAppError = (error: unknown): error is AppError => error instanceof AppError;
