import {
  TIMELINE_BREWS_PER_VERSION_MAX,
  TIMELINE_MESSAGES_PER_VERSION_MAX,
  TIMELINE_VERSIONS_MAX,
} from '@brewmate/shared';
import { and, asc, count, desc, eq, inArray, isNull, type SQL } from 'drizzle-orm';

import type { Database } from '../../db/databaseTypes.js';
import { brewLogsTable } from '../../db/schema/brewLogsTable.js';
import type { BrewLogRow } from '../../db/schema/brewLogsTable.js';
import { recipeChatMessagesTable } from '../../db/schema/recipeChatMessagesTable.js';
import type { RecipeChatMessageRow } from '../../db/schema/recipeChatMessagesTable.js';
import { recipesTable } from '../../db/schema/recipesTable.js';
import type { RecipeRow } from '../../db/schema/recipesTable.js';

/**
 * The read ceilings, derived from the contract's own caps.
 *
 * A timeline can hold forty versions and prints twenty notes and twenty cups
 * under each, so nothing beyond that product is ever displayed. Reading it
 * anyway would be paying for rows to throw away - and reading without a
 * ceiling at all would make one very talkative recipe an unbounded query.
 */
const MESSAGE_ROW_LIMIT = TIMELINE_VERSIONS_MAX * TIMELINE_MESSAGES_PER_VERSION_MAX;
const BREW_ROW_LIMIT = TIMELINE_VERSIONS_MAX * TIMELINE_BREWS_PER_VERSION_MAX;

export interface TimelineFilter {
  readonly userId: string;
  readonly methodId: string;
  /** Null is the quick-brew line, not "any bag". */
  readonly bagId: string | null;
}

/** How many rows really exist behind a version, whatever the capped list shows. */
export interface RecipeRowCount {
  readonly recipeId: string;
  readonly total: number;
}

export interface HistoryRepository {
  listVersions(filter: TimelineFilter): Promise<readonly RecipeRow[]>;
  listBrews(userId: string, recipeIds: readonly string[]): Promise<readonly BrewLogRow[]>;
  countBrews(userId: string, recipeIds: readonly string[]): Promise<readonly RecipeRowCount[]>;
  listMessages(recipeIds: readonly string[]): Promise<readonly RecipeChatMessageRow[]>;
  countMessages(recipeIds: readonly string[]): Promise<readonly RecipeRowCount[]>;
}

/**
 * "The same pair" has to spell out the null case explicitly: `bag_id = null`
 * is never true in SQL, so the quick-brew line would come back empty rather
 * than come back at all.
 */
const sameBag = (bagId: string | null): SQL | undefined =>
  bagId === null ? isNull(recipesTable.bagId) : eq(recipesTable.bagId, bagId);

export const createHistoryRepository = (db: Database): HistoryRepository => ({
  /**
   * Newest first, so the ceiling keeps the versions somebody is actually
   * looking for. The service turns them the right way round afterwards: a
   * timeline reads as a story, and a story starts at the beginning.
   */
  listVersions: async ({ userId, methodId, bagId }) =>
    db
      .select()
      .from(recipesTable)
      .where(
        and(eq(recipesTable.userId, userId), eq(recipesTable.methodId, methodId), sameBag(bagId)),
      )
      .orderBy(desc(recipesTable.createdAt))
      .limit(TIMELINE_VERSIONS_MAX),

  listBrews: async (userId, recipeIds) =>
    recipeIds.length === 0
      ? []
      : db
          .select()
          .from(brewLogsTable)
          .where(
            and(eq(brewLogsTable.userId, userId), inArray(brewLogsTable.recipeId, [...recipeIds])),
          )
          .orderBy(desc(brewLogsTable.createdAt))
          .limit(BREW_ROW_LIMIT),

  countBrews: async (userId, recipeIds) =>
    recipeIds.length === 0
      ? []
      : db
          .select({ recipeId: brewLogsTable.recipeId, total: count() })
          .from(brewLogsTable)
          .where(
            and(eq(brewLogsTable.userId, userId), inArray(brewLogsTable.recipeId, [...recipeIds])),
          )
          .groupBy(brewLogsTable.recipeId),

  /**
   * Messages carry no `user_id` of their own - ownership lives on the recipe -
   * so these queries take ids the caller has already been proved to own. That
   * is the same rule the chat repository follows, and the reason this reads
   * the versions first rather than joining everything in one statement.
   */
  listMessages: async (recipeIds) =>
    recipeIds.length === 0
      ? []
      : db
          .select()
          .from(recipeChatMessagesTable)
          .where(inArray(recipeChatMessagesTable.recipeId, [...recipeIds]))
          .orderBy(asc(recipeChatMessagesTable.createdAt))
          .limit(MESSAGE_ROW_LIMIT),

  countMessages: async (recipeIds) =>
    recipeIds.length === 0
      ? []
      : db
          .select({ recipeId: recipeChatMessagesTable.recipeId, total: count() })
          .from(recipeChatMessagesTable)
          .where(inArray(recipeChatMessagesTable.recipeId, [...recipeIds]))
          .groupBy(recipeChatMessagesTable.recipeId),
});
