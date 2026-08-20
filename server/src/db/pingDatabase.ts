import { sql } from 'drizzle-orm';

import { DATABASE_PING_QUERY } from '../constants/databaseDefaults.js';

import type { Database } from './databaseTypes.js';

/**
 * @returns true when the database answered a trivial query.
 */
export const pingDatabase = async (db: Database): Promise<boolean> => {
  await db.execute(sql.raw(DATABASE_PING_QUERY));

  return true;
};
