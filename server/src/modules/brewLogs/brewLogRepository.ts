import { and, count, desc, eq, type SQL } from 'drizzle-orm';

import { EXTRA_ROW_FOR_HAS_MORE } from '../../constants/pagination.js';
import type { Database } from '../../db/databaseTypes.js';
import { firstRowOrNull } from '../../db/rows/firstRowOrNull.js';
import { requireRow } from '../../db/rows/requireRow.js';
import type { BrewLogRow, NewBrewLogRow } from '../../db/schema/brewLogsTable.js';
import { brewLogsTable } from '../../db/schema/brewLogsTable.js';

const NO_ROWS = 0;

export interface BrewLogListFilter {
  readonly userId: string;
  readonly limit: number;
  readonly offset: number;
  readonly bagId?: string;
  readonly recipeId?: string;
  readonly equipmentSetId?: string;
}

export interface BrewLogRepository {
  /** Reads one row beyond the page, so the caller can answer `hasMore`. */
  list(filter: BrewLogListFilter): Promise<readonly BrewLogRow[]>;
  findById(id: string, userId: string): Promise<BrewLogRow | null>;
  create(input: NewBrewLogRow): Promise<BrewLogRow>;
  updateById(
    id: string,
    userId: string,
    changes: Partial<NewBrewLogRow>,
  ): Promise<BrewLogRow | null>;
  deleteById(id: string, userId: string): Promise<boolean>;
  /** How many logs point at a recipe - the check before a recipe may be deleted. */
  countByRecipe(recipeId: string, userId: string): Promise<number>;
}

const ownedBy = (id: string, userId: string): SQL | undefined =>
  and(eq(brewLogsTable.id, id), eq(brewLogsTable.userId, userId));

export const createBrewLogRepository = (db: Database): BrewLogRepository => ({
  list: async ({
    userId,
    limit,
    offset,
    bagId,
    recipeId,
    equipmentSetId,
  }): Promise<readonly BrewLogRow[]> => {
    const conditions: (SQL | undefined)[] = [eq(brewLogsTable.userId, userId)];

    if (bagId !== undefined) {
      conditions.push(eq(brewLogsTable.bagId, bagId));
    }

    if (recipeId !== undefined) {
      conditions.push(eq(brewLogsTable.recipeId, recipeId));
    }

    if (equipmentSetId !== undefined) {
      conditions.push(eq(brewLogsTable.equipmentSetId, equipmentSetId));
    }

    return db
      .select()
      .from(brewLogsTable)
      .where(and(...conditions))
      .orderBy(desc(brewLogsTable.createdAt))
      .limit(limit + EXTRA_ROW_FOR_HAS_MORE)
      .offset(offset);
  },

  findById: async (id, userId) =>
    firstRowOrNull(await db.select().from(brewLogsTable).where(ownedBy(id, userId))),

  create: async (input) => requireRow(await db.insert(brewLogsTable).values(input).returning()),

  updateById: async (id, userId, changes) =>
    firstRowOrNull(
      await db.update(brewLogsTable).set(changes).where(ownedBy(id, userId)).returning(),
    ),

  deleteById: async (id, userId) =>
    (await db.delete(brewLogsTable).where(ownedBy(id, userId)).returning()).length > NO_ROWS,

  countByRecipe: async (recipeId, userId): Promise<number> => {
    const rows = await db
      .select({ total: count() })
      .from(brewLogsTable)
      .where(and(eq(brewLogsTable.recipeId, recipeId), eq(brewLogsTable.userId, userId)));

    return rows[0]?.total ?? NO_ROWS;
  },
});
