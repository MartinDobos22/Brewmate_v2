import { randomUUID } from 'node:crypto';

import { HTTP_METHODS } from '../constants/httpMethods.js';
import { HTTP_HEADER_NAMES } from './constants/telemetryHeaders.js';
import {
  ENVELOPE_LINE_SEPARATOR,
  MILLISECONDS_PER_SECOND,
  NO_DASHES,
  SENTRY_API_PATH,
  SENTRY_AUTH_HEADER,
  SENTRY_CLIENT_NAME,
  SENTRY_CONTENT_TYPE,
  SENTRY_ENVELOPE_PATH,
  SENTRY_ITEM_TYPE,
  SENTRY_LEVEL_ERROR,
  SENTRY_PLATFORM,
  SENTRY_PROTOCOL_VERSION,
  SENTRY_TIMEOUT_MS,
  STACK_MAX_LENGTH,
  UUID_DASH_PATTERN,
} from './constants/sentryProtocol.js';
import type { ErrorContext, ErrorTracker } from './errorTracker.js';
import type { SentryDsn } from './parseSentryDsn.js';

const NO_STACK = 0;
const UNKNOWN_ERROR_TYPE = 'UnknownError';

export interface SentryTrackerOptions {
  readonly dsn: SentryDsn;
  readonly environment: string;
  /** Called when a report could not be sent, so a silence is never total. */
  readonly onFailure: (cause: unknown) => void;
}

const describeError = (
  error: unknown,
): { readonly type: string; readonly value: string; readonly stack: string | null } =>
  error instanceof Error
    ? {
        type: error.name,
        value: error.message,
        stack: error.stack?.slice(NO_STACK, STACK_MAX_LENGTH) ?? null,
      }
    : { type: UNKNOWN_ERROR_TYPE, value: String(error), stack: null };

/**
 * Reports unexpected failures over Sentry's envelope endpoint.
 *
 * Written against the wire format rather than pulled in as a dependency, and
 * that is a deliberate trade. The whole of what this server needs is one
 * POST of newline-delimited JSON; the SDK that would send it also installs
 * global handlers, patches modules and collects breadcrumbs, which on a server
 * whose logging, redaction and error envelope are already decided is a second
 * opinion about all three. The endpoint is also the stable part of Sentry -
 * every compatible receiver speaks it - so this is what keeps "Sentry or
 * something like it" honest.
 *
 * What travels is the error, the route and two ids. No body, no headers, no
 * query string, no email: `redactPaths` already decides what may be logged,
 * and a reporter that quietly sent more than the log does would make that
 * decision meaningless.
 */
export const createSentryErrorTracker = ({
  dsn,
  environment,
  onFailure,
}: SentryTrackerOptions): ErrorTracker => {
  const url = `${dsn.endpoint}${SENTRY_API_PATH}${dsn.projectId}${SENTRY_ENVELOPE_PATH}`;
  const auth = [
    `Sentry sentry_version=${SENTRY_PROTOCOL_VERSION}`,
    `sentry_client=${SENTRY_CLIENT_NAME}`,
    `sentry_key=${dsn.publicKey}`,
  ].join(', ');

  return {
    /**
     * Deliberately not awaited by the caller.
     *
     * The failure it describes has already been turned into a response; making
     * somebody's request wait on a third party's availability would turn a
     * reporting outage into a latency problem for every 500 the API returns.
     */
    capture: (error: unknown, context: ErrorContext): void => {
      const eventId = randomUUID().replace(UUID_DASH_PATTERN, NO_DASHES);
      const described = describeError(error);

      const envelope = [
        JSON.stringify({ event_id: eventId, dsn: `${dsn.endpoint}/${dsn.projectId}` }),
        JSON.stringify({ type: SENTRY_ITEM_TYPE }),
        JSON.stringify({
          event_id: eventId,
          timestamp: Date.now() / MILLISECONDS_PER_SECOND,
          platform: SENTRY_PLATFORM,
          level: SENTRY_LEVEL_ERROR,
          environment,
          logger: SENTRY_CLIENT_NAME,
          exception: {
            values: [{ type: described.type, value: described.value }],
          },
          /**
           * The stack travels as text rather than as parsed frames. Sentry
           * groups on the type and the message either way, and hand-rolling a
           * frame parser here would be re-implementing the part of an SDK that
           * is genuinely hard in order to save a reader one click.
           */
          extra: described.stack === null ? {} : { stack: described.stack },
          tags: {
            route: context.route ?? null,
            method: context.method ?? null,
            status: context.statusCode ?? null,
            request_id: context.requestId ?? null,
          },
          user: context.userId === undefined ? undefined : { id: context.userId },
          transaction: context.route,
        }),
        '',
      ].join(ENVELOPE_LINE_SEPARATOR);

      void fetch(url, {
        method: HTTP_METHODS.post,
        headers: {
          [HTTP_HEADER_NAMES.contentType]: SENTRY_CONTENT_TYPE,
          [SENTRY_AUTH_HEADER]: auth,
        },
        body: envelope,
        signal: AbortSignal.timeout(SENTRY_TIMEOUT_MS),
      }).catch(onFailure);
    },
  };
};
