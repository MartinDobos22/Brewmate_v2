import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import {
  CONNECTION_TIMEOUT_MS,
  DATABASE_SSL_REQUIRED,
  IDLE_TIMEOUT_MS,
} from '../constants/databaseDefaults.js';

import type { DatabaseConnection } from './databaseTypes.js';
import * as schema from './schema/index.js';

/**
 * Opens a pooled connection to the hosted PostgreSQL instance.
 * The caller owns the returned connection and must close it on shutdown.
 */
export const createDatabase = (url: string, maxConnections: number): DatabaseConnection => {
  const pool = new pg.Pool({
    connectionString: url,
    max: maxConnections,
    ssl: DATABASE_SSL_REQUIRED,
    connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
    idleTimeoutMillis: IDLE_TIMEOUT_MS,
  });

  const db = drizzle(pool, { schema });

  return {
    db,
    pool,
    close: async (): Promise<void> => {
      await pool.end();
    },
  };
};
