import { desc, eq } from 'drizzle-orm';

import { EXTRA_ROW_FOR_HAS_MORE } from '../../constants/pagination.js';
import type { Database } from '../../db/databaseTypes.js';
import { requireRow } from '../../db/rows/requireRow.js';
import type { AiUsageLogRow, NewAiUsageLogRow } from '../../db/schema/aiUsageLogsTable.js';
import { aiUsageLogsTable } from '../../db/schema/aiUsageLogsTable.js';

export interface AiUsageListFilter {
  readonly userId: string;
  readonly limit: number;
  readonly offset: number;
}

export interface AiUsageRepository {
  /** Reads one row beyond the page, so the caller can answer `hasMore`. */
  list(filter: AiUsageListFilter): Promise<readonly AiUsageLogRow[]>;
  /** Called by the services that make the model calls, never by a client. */
  record(input: NewAiUsageLogRow): Promise<AiUsageLogRow>;
}

export const createAiUsageRepository = (db: Database): AiUsageRepository => ({
  list: async ({ userId, limit, offset }) =>
    db
      .select()
      .from(aiUsageLogsTable)
      .where(eq(aiUsageLogsTable.userId, userId))
      .orderBy(desc(aiUsageLogsTable.createdAt))
      .limit(limit + EXTRA_ROW_FOR_HAS_MORE)
      .offset(offset),

  record: async (input) => requireRow(await db.insert(aiUsageLogsTable).values(input).returning()),
});
