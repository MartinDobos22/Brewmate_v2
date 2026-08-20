/**
 * Machine-readable error codes returned by the API.
 * Clients branch on these, never on the human-readable message.
 */
export const ERROR_CODES = {
  badRequest: 'BAD_REQUEST',
  validationFailed: 'VALIDATION_FAILED',
  unauthorized: 'UNAUTHORIZED',
  forbidden: 'FORBIDDEN',
  notFound: 'NOT_FOUND',
  conflict: 'CONFLICT',
  tooManyRequests: 'TOO_MANY_REQUESTS',
  internalError: 'INTERNAL_ERROR',
  serviceUnavailable: 'SERVICE_UNAVAILABLE',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
