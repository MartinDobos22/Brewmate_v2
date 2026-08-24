import { HTTP_HEADERS } from '@brewmate/shared';
import { randomUUID } from 'expo-crypto';
import { Platform } from 'react-native';

import { HTTP_METHODS } from '../../constants/http';

import {
  ENVELOPE_LINE_SEPARATOR,
  EMPTY,
  MILLISECONDS_PER_SECOND,
  REPORT_TIMEOUT_MS,
  SENTRY_API_PATH,
  SENTRY_AUTH_HEADER,
  SENTRY_AUTH_SEPARATOR,
  SENTRY_CLIENT_NAME,
  SENTRY_CONTENT_TYPE,
  SENTRY_ENVELOPE_PATH,
  SENTRY_ITEM_TYPE,
  SENTRY_LEVEL_ERROR,
  SENTRY_PROTOCOL_VERSION,
  STACK_MAX_LENGTH,
  UNKNOWN_ERROR_TYPE,
} from './constants/sentryProtocol';
import type { ErrorContext, ErrorTracker } from './errorTracker';
import type { SentryDsn } from './parseSentryDsn';

const NO_STACK = 0;
const DASH_PATTERN = /-/g;

export interface SentryTrackerOptions {
  readonly dsn: SentryDsn;
  readonly release: string | undefined;
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
 * Reports crashes over Sentry's envelope endpoint.
 *
 * Written against the wire format rather than pulled in as an SDK, and that is
 * a deliberate trade. What this app needs is one POST of newline-delimited
 * JSON; the SDK that would send it also installs global handlers, patches the
 * fetch it does not own and collects breadcrumbs from a UI whose error
 * handling, offline behaviour and Slovak copy are already decided. The
 * endpoint is the stable part of Sentry - every compatible receiver speaks it -
 * which is what keeps "Sentry or something like it" true here.
 *
 * What travels is the error, the platform, the release and a screen name. No
 * request bodies, no email, no coffee. Every sentence somebody writes in this
 * app belongs to them, and a crash reporter is not a reason to make an
 * exception.
 */
export const createSentryErrorTracker = ({ dsn, release }: SentryTrackerOptions): ErrorTracker => {
  const url = `${dsn.endpoint}${SENTRY_API_PATH}${dsn.projectId}${SENTRY_ENVELOPE_PATH}`;
  const auth = [
    `Sentry sentry_version=${SENTRY_PROTOCOL_VERSION}`,
    `sentry_client=${SENTRY_CLIENT_NAME}`,
    `sentry_key=${dsn.publicKey}`,
  ].join(SENTRY_AUTH_SEPARATOR);

  return {
    /**
     * Deliberately not awaited by the caller and unable to reject.
     *
     * The failure it describes has already been turned into something on
     * screen; making somebody wait on a third party's availability would turn
     * a reporting outage into a frozen app.
     */
    capture: (error: unknown, context?: ErrorContext): void => {
      const eventId = randomUUID().replace(DASH_PATTERN, EMPTY);
      const described = describeError(error);

      const envelope = [
        JSON.stringify({ event_id: eventId }),
        JSON.stringify({ type: SENTRY_ITEM_TYPE }),
        JSON.stringify({
          event_id: eventId,
          timestamp: Date.now() / MILLISECONDS_PER_SECOND,
          platform: Platform.OS,
          level: SENTRY_LEVEL_ERROR,
          release,
          logger: SENTRY_CLIENT_NAME,
          exception: { values: [{ type: described.type, value: described.value }] },
          extra: described.stack === null ? {} : { stack: described.stack },
          tags: { screen: context?.screen ?? null, action: context?.action ?? null },
          transaction: context?.screen,
        }),
        EMPTY,
      ].join(ENVELOPE_LINE_SEPARATOR);

      void fetch(url, {
        method: HTTP_METHODS.post,
        headers: {
          [HTTP_HEADERS.contentType]: SENTRY_CONTENT_TYPE,
          [SENTRY_AUTH_HEADER]: auth,
        },
        body: envelope,
        signal: AbortSignal.timeout(REPORT_TIMEOUT_MS),
      }).catch((): void => undefined);
    },
  };
};
