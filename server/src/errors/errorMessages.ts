/** Client-facing error messages. Never inline a message at a throw site. */
export const ERROR_MESSAGES = {
  badRequest: 'The request could not be processed.',
  validationFailed: 'The request payload failed validation.',
  missingAuthorizationHeader: 'Authorization header is missing.',
  malformedAuthorizationHeader: 'Authorization header must use the Bearer scheme.',
  invalidIdToken: 'The Firebase ID token is invalid or has expired.',
  userNotFound: 'The authenticated user no longer exists.',
  routeNotFound: 'The requested route does not exist.',
  internalError: 'An unexpected error occurred.',
  databaseUnavailable: 'The database is not reachable.',
  responseContractViolation: 'The server produced a response that violates its own contract.',
} as const;
