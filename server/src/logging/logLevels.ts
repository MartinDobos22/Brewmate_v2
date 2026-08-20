/** Pino log levels accepted through the LOG_LEVEL environment variable. */
export const LOG_LEVELS = {
  trace: 'trace',
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error',
  fatal: 'fatal',
} as const;

export type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];

export const DEFAULT_LOG_LEVEL: LogLevel = LOG_LEVELS.info;
