/**
 * Values that must never reach the logs. Credentials and identity tokens
 * are replaced by pino before the record is serialised.
 */
export const REDACT_PATHS = [
  'req.headers.authorization',
  'req.headers.cookie',
  'body.password',
  'body.token',
  'config.databaseUrl',
] as const;

export const REDACT_PLACEHOLDER = '[redacted]';
