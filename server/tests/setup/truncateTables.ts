import { sql } from 'drizzle-orm';

import type { Database } from '../../src/db/databaseTypes.js';
import { TABLE_NAMES } from '../../src/db/schema/tableNames.js';

const TRUNCATE_STATEMENT = `truncate table "${TABLE_NAMES.users}" restart identity cascade`;

/** Restores the test branch to an empty state between tests. */
export const truncateTables = async (db: Database): Promise<void> => {
  await db.execute(sql.raw(TRUNCATE_STATEMENT));
};
