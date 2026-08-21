/**
 * Failures that happen before the API can answer, so they have no code from
 * `ERROR_CODES` in @brewmate/shared.
 */
export const API_CLIENT_ERROR_CODES = {
  network: 'CLIENT_NETWORK',
  timeout: 'CLIENT_TIMEOUT',
  invalidResponse: 'CLIENT_INVALID_RESPONSE',
} as const;

export type ApiClientErrorCode =
  (typeof API_CLIENT_ERROR_CODES)[keyof typeof API_CLIENT_ERROR_CODES];
