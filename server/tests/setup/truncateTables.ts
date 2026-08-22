import { sql } from 'drizzle-orm';

import type { Database } from '../../src/db/databaseTypes.js';
import { TRUNCATABLE_TABLE_NAMES } from '../../src/db/schema/tableNames.js';

const TRUNCATE_STATEMENT = `truncate table ${TRUNCATABLE_TABLE_NAMES.map(
  (name: string): string => `"${name}"`,
).join(', ')} restart identity cascade`;

/**
 * Restores the test branch to an empty state between tests.
 *
 * Only the roots are named: everything a user owns cascades from `users`, and
 * the two catalogues belong to nobody, so they are listed explicitly.
 */
export const truncateTables = async (db: Database): Promise<void> => {
  await db.execute(sql.raw(TRUNCATE_STATEMENT));
};
