import { createAnthropicTextCompletionClient } from '../ai/anthropicTextCompletionClient.js';
import { createHttpImageFetcher } from '../ai/httpImageFetcher.js';
import { createFirebaseIdentityDeleter } from '../auth/firebaseIdentityDeleter.js';
import { createFirebaseTokenVerifier } from '../auth/firebaseTokenVerifier.js';
import type { AppConfig } from '../config/appConfig.js';
import { CONFIG_ERROR_MESSAGES } from '../config/configErrorMessages.js';
import { createDatabase } from '../db/createDatabase.js';

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
      ai: resolveAiDependencies(config),
    },
    close: connection.close,
  };
};
