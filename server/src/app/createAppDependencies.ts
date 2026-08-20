import { createFirebaseTokenVerifier } from '../auth/firebaseTokenVerifier.js';
import type { AppConfig } from '../config/appConfig.js';
import { CONFIG_ERROR_MESSAGES } from '../config/configErrorMessages.js';
import { createDatabase } from '../db/createDatabase.js';

import type { AppDependencies } from './appDependencies.js';

export interface RuntimeDependencies {
  readonly dependencies: AppDependencies;
  /** Releases the database pool. */
  readonly close: () => Promise<void>;
}

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
    },
    close: connection.close,
  };
};
