import type { FastifyInstance } from 'fastify';

import { buildApp } from '../../src/app/buildApp.js';
import { loadConfig } from '../../src/config/loadConfig.js';
import { createDatabase } from '../../src/db/createDatabase.js';
import type { Database } from '../../src/db/databaseTypes.js';

import {
  createFakeCompletionClient,
  type RecordingCompletionClient,
} from './fakeCompletionClient.js';
import { createFakeErrorTracker, type RecordingErrorTracker } from './fakeErrorTracker.js';
import { createFakeIdentityDeleter, type RecordingIdentityDeleter } from './fakeIdentityDeleter.js';
import { createFakeImageFetcher } from './fakeImageFetcher.js';
import { createFakeTokenVerifier } from './fakeTokenVerifier.js';
import { truncateTables } from './truncateTables.js';

export interface TestContext {
  readonly app: FastifyInstance;
  readonly db: Database;
  /** The stub Firebase identity provider, so deletions can be asserted on. */
  readonly identityDeleter: RecordingIdentityDeleter;
  /** The stub model, so what it was asked and how often can be asserted on. */
  readonly completionClient: RecordingCompletionClient;
  /** The stub reporter, so it can be asserted which failures were reported. */
  readonly errorTracker: RecordingErrorTracker;
  readonly reset: () => Promise<void>;
  readonly close: () => Promise<void>;
}

/**
 * Boots the real application against the Neon test branch, with the Firebase
 * verifier replaced by a deterministic stub.
 */
export const createTestContext = async (): Promise<TestContext> => {
  const config = loadConfig();
  const connection = createDatabase(config.database.url, config.database.maxConnections);
  const identityDeleter = createFakeIdentityDeleter();
  const completionClient = createFakeCompletionClient();
  const errorTracker = createFakeErrorTracker();
  const app = await buildApp({
    config,
    db: connection.db,
    tokenVerifier: createFakeTokenVerifier(),
    identityDeleter,
    errorTracker,
    ai: { completionClient, imageFetcher: createFakeImageFetcher() },
  });

  await app.ready();

  return {
    app,
    db: connection.db,
    identityDeleter,
    completionClient,
    errorTracker,
    reset: async (): Promise<void> => {
      identityDeleter.reset();
      completionClient.reset();
      errorTracker.reset();
      await truncateTables(connection.db);
    },
    close: async (): Promise<void> => {
      await app.close();
      await connection.close();
    },
  };
};
