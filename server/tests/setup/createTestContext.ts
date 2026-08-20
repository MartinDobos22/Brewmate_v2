import type { FastifyInstance } from 'fastify';

import { buildApp } from '../../src/app/buildApp.js';
import { loadConfig } from '../../src/config/loadConfig.js';
import { createDatabase } from '../../src/db/createDatabase.js';
import type { Database } from '../../src/db/databaseTypes.js';

import { createFakeTokenVerifier } from './fakeTokenVerifier.js';
import { truncateTables } from './truncateTables.js';

export interface TestContext {
  readonly app: FastifyInstance;
  readonly db: Database;
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
  const app = await buildApp({
    config,
    db: connection.db,
    tokenVerifier: createFakeTokenVerifier(),
  });

  await app.ready();

  return {
    app,
    db: connection.db,
    reset: async (): Promise<void> => {
      await truncateTables(connection.db);
    },
    close: async (): Promise<void> => {
      await app.close();
      await connection.close();
    },
  };
};
