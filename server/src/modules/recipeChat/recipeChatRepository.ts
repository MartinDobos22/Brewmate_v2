import { asc, eq } from 'drizzle-orm';

import { EXTRA_ROW_FOR_HAS_MORE } from '../../constants/pagination.js';
import type { Database } from '../../db/databaseTypes.js';
import { requireRow } from '../../db/rows/requireRow.js';
import type {
  NewRecipeChatMessageRow,
  RecipeChatMessageRow,
} from '../../db/schema/recipeChatMessagesTable.js';
import { recipeChatMessagesTable } from '../../db/schema/recipeChatMessagesTable.js';

export interface RecipeChatListFilter {
  readonly recipeId: string;
  readonly limit: number;
  readonly offset: number;
}

export interface RecipeChatRepository {
  /** Reads one row beyond the page, so the caller can answer `hasMore`. */
  list(filter: RecipeChatListFilter): Promise<readonly RecipeChatMessageRow[]>;
  create(input: NewRecipeChatMessageRow): Promise<RecipeChatMessageRow>;
}

/**
 * There is no user filter here, and there must not be one: this table has no
 * `user_id`. The service resolves the recipe for the caller first, and only a
 * recipe that came back from that lookup ever reaches these queries.
 */
export const createRecipeChatRepository = (db: Database): RecipeChatRepository => ({
  list: async ({ recipeId, limit, offset }) =>
    db
      .select()
      .from(recipeChatMessagesTable)
      .where(eq(recipeChatMessagesTable.recipeId, recipeId))
      .orderBy(asc(recipeChatMessagesTable.createdAt))
      .limit(limit + EXTRA_ROW_FOR_HAS_MORE)
      .offset(offset),

  create: async (input) =>
    requireRow(await db.insert(recipeChatMessagesTable).values(input).returning()),
});
