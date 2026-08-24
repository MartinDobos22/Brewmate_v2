import { pino } from 'pino';

import { createAnthropicTextCompletionClient } from '../ai/anthropicTextCompletionClient.js';
import { createHttpImageFetcher } from '../ai/httpImageFetcher.js';
import { createFirebaseIdentityDeleter } from '../auth/firebaseIdentityDeleter.js';
import { createFirebaseTokenVerifier } from '../auth/firebaseTokenVerifier.js';
import type { AppConfig } from '../config/appConfig.js';
import { CONFIG_ERROR_MESSAGES } from '../config/configErrorMessages.js';
import { createDatabase } from '../db/createDatabase.js';
import { LOG_MESSAGES } from '../logging/logMessages.js';
import type { ErrorTracker } from '../telemetry/errorTracker.js';
import { createNoopErrorTracker } from '../telemetry/noopErrorTracker.js';
import { parseSentryDsn } from '../telemetry/parseSentryDsn.js';
import { createSentryErrorTracker } from '../telemetry/sentryErrorTracker.js';

import type { AiDependencies } from './aiDependencies.js';
import type { AppDependencies } from './appDependencies.js';

export interface RuntimeDependencies {
  readonly dependencies: AppDependencies;
  /** Releases the database pool. */
  readonly close: () => Promise<void>;
}

/**
 * @returns the real provider, or null when no key is configured.
 *
 * A missing key is not a start-up failure: every screen that asks no model
 * anything keeps working, and the two that do say so.
 */
const resolveAiDependencies = (config: AppConfig): AiDependencies | null =>
  config.ai === null
    ? null
    : {
        completionClient: createAnthropicTextCompletionClient(config.ai),
        imageFetcher: createHttpImageFetcher(),
      };

/**
 * @returns the real reporter, or the one that does nothing.
 *
 * A DSN that will not parse is reported once and then ignored, rather than
 * stopping a server that is otherwise ready to serve: error reporting is a
 * thing added on top of the log, and a typo in it must not be able to take the
 * API down. Its own delivery failures go to the log for the same reason - a
 * reporter that cannot reach its provider must not be able to fail a request
 * that has already been answered.
 */
const resolveErrorTracker = (config: AppConfig): ErrorTracker => {
  if (config.telemetry === null) {
    return createNoopErrorTracker();
  }

  const logger = pino();
  const dsn = parseSentryDsn(config.telemetry.errorReportingDsn);

  if (dsn === null) {
    logger.warn(LOG_MESSAGES.errorReportingDsnInvalid);

    return createNoopErrorTracker();
  }

  logger.info({ environment: config.environment }, LOG_MESSAGES.errorReportingConfigured);

  return createSentryErrorTracker({
    dsn,
    environment: config.environment,
    onFailure: (cause: unknown): void => {
      logger.warn({ err: cause }, LOG_MESSAGES.errorReportFailed);
    },
  });
};

/** Production wiring: hosted PostgreSQL plus the real Firebase Admin verifier. */
export const createAppDependencies = (config: AppConfig): RuntimeDependencies => {
  if (config.firebase === null) {
    throw new Error(CONFIG_ERROR_MESSAGES.firebaseCredentialsUnavailable);
  }

  const connection = createDatabase(config.database.url, config.database.maxConnections);

  return {
    dependencies: {
      config,
      db: connection.db,
      tokenVerifier: createFirebaseTokenVerifier(config.firebase),
      identityDeleter: createFirebaseIdentityDeleter(config.firebase),
      errorTracker: resolveErrorTracker(config),
      ai: resolveAiDependencies(config),
    },
    close: connection.close,
  };
};
