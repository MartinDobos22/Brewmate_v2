import { and, desc, eq, type SQL } from 'drizzle-orm';

import { EXTRA_ROW_FOR_HAS_MORE } from '../../constants/pagination.js';
import type { Database } from '../../db/databaseTypes.js';
import { firstRowOrNull } from '../../db/rows/firstRowOrNull.js';
import { requireRow } from '../../db/rows/requireRow.js';
import type { CoffeeBagRow, NewCoffeeBagRow } from '../../db/schema/coffeeBagsTable.js';
import { coffeeBagsTable } from '../../db/schema/coffeeBagsTable.js';

const ARCHIVED = true;

export interface CoffeeBagListFilter {
  readonly userId: string;
  readonly limit: number;
  readonly offset: number;
  readonly includeArchived?: boolean;
}

export interface CoffeeBagRepository {
  /** Reads one row beyond the page, so the caller can answer `hasMore`. */
  list(filter: CoffeeBagListFilter): Promise<readonly CoffeeBagRow[]>;
  findById(id: string, userId: string): Promise<CoffeeBagRow | null>;
  create(input: NewCoffeeBagRow): Promise<CoffeeBagRow>;
  updateById(
    id: string,
    userId: string,
    changes: Partial<NewCoffeeBagRow>,
  ): Promise<CoffeeBagRow | null>;
}

const ownedBy = (id: string, userId: string): SQL | undefined =>
  and(eq(coffeeBagsTable.id, id), eq(coffeeBagsTable.userId, userId));

export const createCoffeeBagRepository = (db: Database): CoffeeBagRepository => ({
  list: async ({
    userId,
    limit,
    offset,
    includeArchived,
  }): Promise<readonly CoffeeBagRow[]> => {
    const conditions: (SQL | undefined)[] = [eq(coffeeBagsTable.userId, userId)];

    if (includeArchived !== true) {
      conditions.push(eq(coffeeBagsTable.isArchived, !ARCHIVED));
    }

    return db
      .select()
      .from(coffeeBagsTable)
      .where(and(...conditions))
      .orderBy(desc(coffeeBagsTable.createdAt))
      .limit(limit + EXTRA_ROW_FOR_HAS_MORE)
      .offset(offset);
  },

  findById: async (id, userId) =>
    firstRowOrNull(await db.select().from(coffeeBagsTable).where(ownedBy(id, userId))),

  create: async (input) => requireRow(await db.insert(coffeeBagsTable).values(input).returning()),

  updateById: async (id, userId, changes) =>
    firstRowOrNull(
      await db
        .update(coffeeBagsTable)
        .set({ ...changes, updatedAt: new Date() })
        .where(ownedBy(id, userId))
        .returning(),
    ),
});
