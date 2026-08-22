import type { TasteProfileDelta, TasteProfileSource } from '@brewmate/shared';
import { and, asc, desc, eq } from 'drizzle-orm';

import { EXTRA_ROW_FOR_HAS_MORE } from '../../constants/pagination.js';
import type { Database } from '../../db/databaseTypes.js';
import { firstRowOrNull } from '../../db/rows/firstRowOrNull.js';
import { requireRow } from '../../db/rows/requireRow.js';
import type {
  NewTasteProfileEventRow,
  TasteProfileEventRow,
} from '../../db/schema/tasteProfileEventsTable.js';
import { tasteProfileEventsTable } from '../../db/schema/tasteProfileEventsTable.js';

export interface TasteProfileEventListFilter {
  readonly userId: string;
  readonly limit: number;
  readonly offset: number;
}

export interface TasteProfileEventRepository {
  /** Reads one row beyond the page, so the caller can answer `hasMore`. */
  list(filter: TasteProfileEventListFilter): Promise<readonly TasteProfileEventRow[]>;
  /** The whole trail, oldest first - the order a fold has to replay. */
  listForReplay(userId: string): Promise<readonly TasteProfileEventRow[]>;
  findById(id: string, userId: string): Promise<TasteProfileEventRow | null>;
  findBySourceRef(
    userId: string,
    source: TasteProfileSource,
    sourceRef: string,
  ): Promise<TasteProfileEventRow | null>;
  create(input: NewTasteProfileEventRow): Promise<TasteProfileEventRow>;
  /** Records what the reducer decided, so a replay can be audited against it. */
  saveAppliedDeltas(deltas: ReadonlyMap<string, TasteProfileDelta>): Promise<void>;
}

export const createTasteProfileEventRepository = (db: Database): TasteProfileEventRepository => ({
  list: async ({ userId, limit, offset }) =>
    db
      .select()
      .from(tasteProfileEventsTable)
      .where(eq(tasteProfileEventsTable.userId, userId))
      .orderBy(desc(tasteProfileEventsTable.createdAt))
      .limit(limit + EXTRA_ROW_FOR_HAS_MORE)
      .offset(offset),

  listForReplay: async (userId) =>
    db
      .select()
      .from(tasteProfileEventsTable)
      .where(eq(tasteProfileEventsTable.userId, userId))
      .orderBy(asc(tasteProfileEventsTable.createdAt), asc(tasteProfileEventsTable.id)),

  findById: async (id, userId) =>
    firstRowOrNull(
      await db
        .select()
        .from(tasteProfileEventsTable)
        .where(and(eq(tasteProfileEventsTable.id, id), eq(tasteProfileEventsTable.userId, userId))),
    ),

  findBySourceRef: async (userId, source, sourceRef) =>
    firstRowOrNull(
      await db
        .select()
        .from(tasteProfileEventsTable)
        .where(
          and(
            eq(tasteProfileEventsTable.userId, userId),
            eq(tasteProfileEventsTable.source, source),
            eq(tasteProfileEventsTable.sourceRef, sourceRef),
          ),
        ),
    ),

  create: async (input) =>
    requireRow(await db.insert(tasteProfileEventsTable).values(input).returning()),

  saveAppliedDeltas: async (deltas): Promise<void> => {
    await db.transaction(async (tx): Promise<void> => {
      for (const [id, appliedDelta] of deltas) {
        await tx
          .update(tasteProfileEventsTable)
          .set({ appliedDelta })
          .where(eq(tasteProfileEventsTable.id, id));
      }
    });
  },
});
