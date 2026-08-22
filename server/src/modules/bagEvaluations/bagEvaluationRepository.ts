import { and, desc, eq, type SQL } from 'drizzle-orm';

import { EXTRA_ROW_FOR_HAS_MORE } from '../../constants/pagination.js';
import type { Database } from '../../db/databaseTypes.js';
import { firstRowOrNull } from '../../db/rows/firstRowOrNull.js';
import { requireRow } from '../../db/rows/requireRow.js';
import type { BagEvaluationRow, NewBagEvaluationRow } from '../../db/schema/bagEvaluationsTable.js';
import { bagEvaluationsTable } from '../../db/schema/bagEvaluationsTable.js';

export interface BagEvaluationListFilter {
  readonly userId: string;
  readonly limit: number;
  readonly offset: number;
}

export interface BagEvaluationRepository {
  /** Reads one row beyond the page, so the caller can answer `hasMore`. */
  list(filter: BagEvaluationListFilter): Promise<readonly BagEvaluationRow[]>;
  findById(id: string, userId: string): Promise<BagEvaluationRow | null>;
  create(input: NewBagEvaluationRow): Promise<BagEvaluationRow>;
  updateById(
    id: string,
    userId: string,
    changes: Partial<NewBagEvaluationRow>,
  ): Promise<BagEvaluationRow | null>;
}

const ownedBy = (id: string, userId: string): SQL | undefined =>
  and(eq(bagEvaluationsTable.id, id), eq(bagEvaluationsTable.userId, userId));

export const createBagEvaluationRepository = (db: Database): BagEvaluationRepository => ({
  list: async ({ userId, limit, offset }) =>
    db
      .select()
      .from(bagEvaluationsTable)
      .where(eq(bagEvaluationsTable.userId, userId))
      .orderBy(desc(bagEvaluationsTable.createdAt))
      .limit(limit + EXTRA_ROW_FOR_HAS_MORE)
      .offset(offset),

  findById: async (id, userId) =>
    firstRowOrNull(await db.select().from(bagEvaluationsTable).where(ownedBy(id, userId))),

  create: async (input) =>
    requireRow(await db.insert(bagEvaluationsTable).values(input).returning()),

  updateById: async (id, userId, changes) =>
    firstRowOrNull(
      await db.update(bagEvaluationsTable).set(changes).where(ownedBy(id, userId)).returning(),
    ),
});
