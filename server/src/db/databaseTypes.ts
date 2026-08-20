import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { Pool } from 'pg';

import type * as schema from './schema/index.js';

/** The Drizzle handle passed to repositories. */
export type Database = NodePgDatabase<typeof schema>;

/** A database handle plus ownership of the underlying pool. */
export interface DatabaseConnection {
  readonly db: Database;
  readonly pool: Pool;
  readonly close: () => Promise<void>;
}
