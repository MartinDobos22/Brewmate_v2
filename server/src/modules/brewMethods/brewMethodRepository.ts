import type { BrewMethodCategory } from '@brewmate/shared';
import { and, asc, eq, type SQL } from 'drizzle-orm';

import { EXTRA_ROW_FOR_HAS_MORE } from '../../constants/pagination.js';
import type { Database } from '../../db/databaseTypes.js';
import { firstRowOrNull } from '../../db/rows/firstRowOrNull.js';
import { requireRow } from '../../db/rows/requireRow.js';
import type { BrewMethodRow, NewBrewMethodRow } from '../../db/schema/brewMethodsTable.js';
import { brewMethodsTable } from '../../db/schema/brewMethodsTable.js';

const ACTIVE = true;

export interface BrewMethodListFilter {
  readonly limit: number;
  readonly offset: number;
  readonly category?: BrewMethodCategory;
  readonly includeInactive?: boolean;
}

export interface BrewMethodRepository {
  /** Reads one row beyond the page, so the caller can answer `hasMore`. */
  list(filter: BrewMethodListFilter): Promise<readonly BrewMethodRow[]>;
  findById(id: string): Promise<BrewMethodRow | null>;
  findByKey(key: string): Promise<BrewMethodRow | null>;
  /** Used by the seed; a method is identified by its stable `key`. */
  upsertByKey(input: NewBrewMethodRow): Promise<BrewMethodRow>;
}

export const createBrewMethodRepository = (db: Database): BrewMethodRepository => ({
  list: async ({
    limit,
    offset,
    category,
    includeInactive,
  }): Promise<readonly BrewMethodRow[]> => {
    const conditions: SQL[] = [];

    if (category !== undefined) {
      conditions.push(eq(brewMethodsTable.category, category));
    }

    if (includeInactive !== true) {
      conditions.push(eq(brewMethodsTable.isActive, ACTIVE));
    }

    return db
      .select()
      .from(brewMethodsTable)
      .where(and(...conditions))
      .orderBy(asc(brewMethodsTable.sortOrder), asc(brewMethodsTable.nameSk))
      .limit(limit + EXTRA_ROW_FOR_HAS_MORE)
      .offset(offset);
  },

  findById: async (id) =>
    firstRowOrNull(await db.select().from(brewMethodsTable).where(eq(brewMethodsTable.id, id))),

  findByKey: async (key) =>
    firstRowOrNull(await db.select().from(brewMethodsTable).where(eq(brewMethodsTable.key, key))),

  upsertByKey: async (input) =>
    requireRow(
      await db
        .insert(brewMethodsTable)
        .values(input)
        .onConflictDoUpdate({ target: brewMethodsTable.key, set: input })
        .returning(),
    ),
});
