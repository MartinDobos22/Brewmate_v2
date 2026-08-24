/**
 * The handful of constants the envelope format needs.
 *
 * Written down rather than inlined for the usual reason, and kept together
 * because they are one protocol: change the version and the header changes
 * with it.
 */
export const SENTRY_PROTOCOL_VERSION = '7';
export const SENTRY_CLIENT_NAME = 'brewmate-server/1';
export const SENTRY_ENVELOPE_PATH = '/envelope/';
export const SENTRY_API_PATH = '/api/';
export const SENTRY_AUTH_HEADER = 'X-Sentry-Auth';
export const SENTRY_ITEM_TYPE = 'event';
export const SENTRY_PLATFORM = 'node';
export const SENTRY_LEVEL_ERROR = 'error';
export const SENTRY_CONTENT_TYPE = 'application/x-sentry-envelope';

/** Envelope lines are newline-delimited JSON, terminated by a newline. */
export const ENVELOPE_LINE_SEPARATOR = '\n';

/** A report is not worth holding a socket open for. */
export const SENTRY_TIMEOUT_MS = 4000;

/** Stack frames beyond this add nothing a reader uses. */
export const STACK_MAX_LENGTH = 8000;

/** Sentry ids are a UUID with the dashes taken out. */
export const UUID_DASH_PATTERN = /-/g;
export const NO_DASHES = '';

export const MILLISECONDS_PER_SECOND = 1000;
