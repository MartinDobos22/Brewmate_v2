import { asc, eq } from 'drizzle-orm';

import type { Database } from '../../db/databaseTypes.js';
import { analyticsEventsTable } from '../../db/schema/analyticsEventsTable.js';
import type {
  AnalyticsEventRow,
  NewAnalyticsEventRow,
} from '../../db/schema/analyticsEventsTable.js';

export interface AnalyticsRepository {
  /** Writes a whole flushed batch in one statement. */
  recordAll(rows: readonly NewAnalyticsEventRow[]): Promise<number>;
  /** Everything this account's phone ever sent, for the GDPR export. */
  listForUser(userId: string): Promise<readonly AnalyticsEventRow[]>;
}

export const createAnalyticsRepository = (db: Database): AnalyticsRepository => ({
  recordAll: async (rows) =>
    (
      await db
        .insert(analyticsEventsTable)
        .values([...rows])
        .returning({ id: analyticsEventsTable.id })
    ).length,

  listForUser: async (userId) =>
    db
      .select()
      .from(analyticsEventsTable)
      .where(eq(analyticsEventsTable.userId, userId))
      .orderBy(asc(analyticsEventsTable.occurredAt)),
});
