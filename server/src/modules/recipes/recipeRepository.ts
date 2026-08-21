import { and, desc, eq, isNull, type SQL } from 'drizzle-orm';

import { EXTRA_ROW_FOR_HAS_MORE } from '../../constants/pagination.js';
import type { Database } from '../../db/databaseTypes.js';
import { firstRowOrNull } from '../../db/rows/firstRowOrNull.js';
import { requireRow } from '../../db/rows/requireRow.js';
import type { NewRecipeRow, RecipeRow } from '../../db/schema/recipesTable.js';
import { recipesTable } from '../../db/schema/recipesTable.js';

const NO_ROWS = 0;
const SAVED = true;
const PINNED = true;
const NOT_PINNED = false;

export interface RecipeListFilter {
  readonly userId: string;
  readonly limit: number;
  readonly offset: number;
  readonly bagId?: string;
  readonly methodId?: string;
  readonly savedOnly?: boolean;
  readonly pinnedOnly?: boolean;
}

export interface RecipeRepository {
  /** Reads one row beyond the page, so the caller can answer `hasMore`. */
  list(filter: RecipeListFilter): Promise<readonly RecipeRow[]>;
  findById(id: string, userId: string): Promise<RecipeRow | null>;
  create(input: NewRecipeRow): Promise<RecipeRow>;
  updateById(id: string, userId: string, changes: Partial<NewRecipeRow>): Promise<RecipeRow | null>;
  deleteById(id: string, userId: string): Promise<boolean>;
  /** Unpins whatever shared this (bag, method) pair, then pins this one. */
  pin(id: string, userId: string): Promise<RecipeRow | null>;
}

const ownedBy = (id: string, userId: string): SQL | undefined =>
  and(eq(recipesTable.id, id), eq(recipesTable.userId, userId));

/**
 * "The same pair" has to spell out the null case explicitly: `bag_id = null`
 * is never true in SQL, so a quick brew without a bag would silently match
 * nothing and every bagless recipe would stay pinned.
 */
const sameBag = (bagId: string | null): SQL | undefined =>
  bagId === null ? isNull(recipesTable.bagId) : eq(recipesTable.bagId, bagId);

export const createRecipeRepository = (db: Database): RecipeRepository => ({
  list: async ({
    userId,
    limit,
    offset,
    bagId,
    methodId,
    savedOnly,
    pinnedOnly,
  }): Promise<readonly RecipeRow[]> => {
    const conditions: (SQL | undefined)[] = [eq(recipesTable.userId, userId)];

    if (bagId !== undefined) {
      conditions.push(eq(recipesTable.bagId, bagId));
    }

    if (methodId !== undefined) {
      conditions.push(eq(recipesTable.methodId, methodId));
    }

    if (savedOnly === true) {
      conditions.push(eq(recipesTable.isSaved, SAVED));
    }

    if (pinnedOnly === true) {
      conditions.push(eq(recipesTable.isPinned, PINNED));
    }

    return db
      .select()
      .from(recipesTable)
      .where(and(...conditions))
      .orderBy(desc(recipesTable.isPinned), desc(recipesTable.createdAt))
      .limit(limit + EXTRA_ROW_FOR_HAS_MORE)
      .offset(offset);
  },

  findById: async (id, userId) =>
    firstRowOrNull(await db.select().from(recipesTable).where(ownedBy(id, userId))),

  create: async (input) => requireRow(await db.insert(recipesTable).values(input).returning()),

  updateById: async (id, userId, changes) =>
    firstRowOrNull(
      await db
        .update(recipesTable)
        .set({ ...changes, updatedAt: new Date() })
        .where(ownedBy(id, userId))
        .returning(),
    ),

  deleteById: async (id, userId) =>
    (await db.delete(recipesTable).where(ownedBy(id, userId)).returning()).length > NO_ROWS,

  pin: async (id, userId) =>
    db.transaction(async (tx): Promise<RecipeRow | null> => {
      const target = firstRowOrNull(
        await tx.select().from(recipesTable).where(ownedBy(id, userId)),
      );

      if (target === null) {
        return null;
      }

      await tx
        .update(recipesTable)
        .set({ isPinned: NOT_PINNED, updatedAt: new Date() })
        .where(
          and(
            eq(recipesTable.userId, userId),
            eq(recipesTable.methodId, target.methodId),
            sameBag(target.bagId),
          ),
        );

      return firstRowOrNull(
        await tx
          .update(recipesTable)
          .set({ isPinned: PINNED, updatedAt: new Date() })
          .where(ownedBy(id, userId))
          .returning(),
      );
    }),
});
