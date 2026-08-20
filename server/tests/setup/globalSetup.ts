import { loadConfig } from '../../src/config/loadConfig.js';
import { runMigrations } from '../../src/db/migrate/runMigrations.js';

import { loadTestEnv } from './loadTestEnv.js';

/** Brings the test branch up to the current schema once per test run. */
export default async function setup(): Promise<void> {
  loadTestEnv();

  const config = loadConfig();

  await runMigrations(config.database.migrationUrl);
}
