import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';

import { CONNECTION_TIMEOUT_MS, DATABASE_SSL_REQUIRED } from '../../constants/databaseDefaults.js';

import { resolveMigrationsFolder } from './migrationsFolder.js';

const MIGRATION_POOL_MAX_CONNECTIONS = 1;

/**
 * Applies every pending migration using a dedicated single-connection pool.
 * Uses the direct (unpooled) endpoint - migrations need a plain session.
 */
export const runMigrations = async (migrationUrl: string): Promise<void> => {
  const pool = new pg.Pool({
    connectionString: migrationUrl,
    max: MIGRATION_POOL_MAX_CONNECTIONS,
    ssl: DATABASE_SSL_REQUIRED,
    connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
  });

  try {
    await migrate(drizzle(pool), { migrationsFolder: resolveMigrationsFolder() });
  } finally {
    await pool.end();
  }
};
