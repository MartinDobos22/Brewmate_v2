/** The handful of constants the envelope format needs. */
export const SENTRY_PROTOCOL_VERSION = '7';
export const SENTRY_CLIENT_NAME = 'brewmate-app/1';
export const SENTRY_ENVELOPE_PATH = '/envelope/';
export const SENTRY_API_PATH = '/api/';
export const SENTRY_AUTH_HEADER = 'X-Sentry-Auth';
export const SENTRY_ITEM_TYPE = 'event';
export const SENTRY_LEVEL_ERROR = 'error';
export const SENTRY_CONTENT_TYPE = 'application/x-sentry-envelope';
export const SENTRY_AUTH_SEPARATOR = ', ';

/** Envelope lines are newline-delimited JSON, terminated by a newline. */
export const ENVELOPE_LINE_SEPARATOR = '\n';

/** Stack frames beyond this add nothing a reader uses. */
export const STACK_MAX_LENGTH = 8000;

/** A report is not worth holding a phone's radio open for. */
export const REPORT_TIMEOUT_MS = 5000;

export const MILLISECONDS_PER_SECOND = 1000;
export const UNKNOWN_ERROR_TYPE = 'UnknownError';
export const PATH_SEPARATOR = '/';
export const EMPTY = '';
