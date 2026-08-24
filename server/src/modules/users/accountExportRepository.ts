import { asc, eq, inArray } from 'drizzle-orm';

import type { Database } from '../../db/databaseTypes.js';
import { aiUsageLogsTable } from '../../db/schema/aiUsageLogsTable.js';
import type { AiUsageLogRow } from '../../db/schema/aiUsageLogsTable.js';
import { analyticsEventsTable } from '../../db/schema/analyticsEventsTable.js';
import type { AnalyticsEventRow } from '../../db/schema/analyticsEventsTable.js';
import { bagEvaluationsTable } from '../../db/schema/bagEvaluationsTable.js';
import type { BagEvaluationRow } from '../../db/schema/bagEvaluationsTable.js';
import { brewLogsTable } from '../../db/schema/brewLogsTable.js';
import type { BrewLogRow } from '../../db/schema/brewLogsTable.js';
import { coffeeBagsTable } from '../../db/schema/coffeeBagsTable.js';
import type { CoffeeBagRow } from '../../db/schema/coffeeBagsTable.js';
import { equipmentTable } from '../../db/schema/equipmentTable.js';
import type { EquipmentRow } from '../../db/schema/equipmentTable.js';
import { equipmentSetsTable } from '../../db/schema/equipmentSetsTable.js';
import type { EquipmentSetRow } from '../../db/schema/equipmentSetsTable.js';
import { insightSuggestionsTable } from '../../db/schema/insightSuggestionsTable.js';
import type { InsightSuggestionRow } from '../../db/schema/insightSuggestionsTable.js';
import { recipeChatMessagesTable } from '../../db/schema/recipeChatMessagesTable.js';
import type { RecipeChatMessageRow } from '../../db/schema/recipeChatMessagesTable.js';
import { recipesTable } from '../../db/schema/recipesTable.js';
import type { RecipeRow } from '../../db/schema/recipesTable.js';
import { tasteProfileEventsTable } from '../../db/schema/tasteProfileEventsTable.js';
import type { TasteProfileEventRow } from '../../db/schema/tasteProfileEventsTable.js';

/** Every user-owned table, read whole. */
export interface AccountExportRows {
  readonly tasteProfileEvents: readonly TasteProfileEventRow[];
  readonly equipment: readonly EquipmentRow[];
  readonly equipmentSets: readonly EquipmentSetRow[];
  readonly coffeeBags: readonly CoffeeBagRow[];
  readonly bagEvaluations: readonly BagEvaluationRow[];
  readonly recipes: readonly RecipeRow[];
  readonly recipeMessages: readonly RecipeChatMessageRow[];
  readonly brewLogs: readonly BrewLogRow[];
  readonly tasteSuggestions: readonly InsightSuggestionRow[];
  readonly aiUsage: readonly AiUsageLogRow[];
  readonly analyticsEvents: readonly AnalyticsEventRow[];
}

export interface AccountExportRepository {
  readAll(userId: string): Promise<AccountExportRows>;
}

/**
 * Reads an account whole, for the one request that is allowed to.
 *
 * Nothing here is paged and nothing is capped, which is the opposite of every
 * other read in this API - and it is the point. An export is only an export if
 * it is complete: a document that quietly stopped at the first thousand brew
 * logs would answer a subject access request with something that looks
 * complete and is not, which is worse than refusing. The cost is one large
 * response for one deliberate action somebody takes about their own account.
 *
 * Chat messages are read by recipe id rather than by user id, because that
 * table carries no `user_id` - ownership lives on the recipe. The recipes are
 * fetched first and the messages follow from them, which is the same rule the
 * chat repository follows and the reason it is one extra query rather than
 * one extra column able to disagree with the first.
 */
export const createAccountExportRepository = (db: Database): AccountExportRepository => ({
  readAll: async (userId): Promise<AccountExportRows> => {
    const recipes = await db
      .select()
      .from(recipesTable)
      .where(eq(recipesTable.userId, userId))
      .orderBy(asc(recipesTable.createdAt));

    const recipeIds = recipes.map((recipe: RecipeRow): string => recipe.id);

    const [
      tasteProfileEvents,
      equipment,
      equipmentSets,
      coffeeBags,
      bagEvaluations,
      recipeMessages,
      brewLogs,
      tasteSuggestions,
      aiUsage,
      analyticsEvents,
    ] = await Promise.all([
      db
        .select()
        .from(tasteProfileEventsTable)
        .where(eq(tasteProfileEventsTable.userId, userId))
        .orderBy(asc(tasteProfileEventsTable.createdAt)),
      db
        .select()
        .from(equipmentTable)
        .where(eq(equipmentTable.userId, userId))
        .orderBy(asc(equipmentTable.createdAt)),
      db
        .select()
        .from(equipmentSetsTable)
        .where(eq(equipmentSetsTable.userId, userId))
        .orderBy(asc(equipmentSetsTable.createdAt)),
      db
        .select()
        .from(coffeeBagsTable)
        .where(eq(coffeeBagsTable.userId, userId))
        .orderBy(asc(coffeeBagsTable.createdAt)),
      db
        .select()
        .from(bagEvaluationsTable)
        .where(eq(bagEvaluationsTable.userId, userId))
        .orderBy(asc(bagEvaluationsTable.createdAt)),
      recipeIds.length === 0
        ? []
        : db
            .select()
            .from(recipeChatMessagesTable)
            .where(inArray(recipeChatMessagesTable.recipeId, recipeIds))
            .orderBy(asc(recipeChatMessagesTable.createdAt)),
      db
        .select()
        .from(brewLogsTable)
        .where(eq(brewLogsTable.userId, userId))
        .orderBy(asc(brewLogsTable.createdAt)),
      db
        .select()
        .from(insightSuggestionsTable)
        .where(eq(insightSuggestionsTable.userId, userId))
        .orderBy(asc(insightSuggestionsTable.createdAt)),
      db
        .select()
        .from(aiUsageLogsTable)
        .where(eq(aiUsageLogsTable.userId, userId))
        .orderBy(asc(aiUsageLogsTable.createdAt)),
      db
        .select()
        .from(analyticsEventsTable)
        .where(eq(analyticsEventsTable.userId, userId))
        .orderBy(asc(analyticsEventsTable.occurredAt)),
    ]);

    return {
      tasteProfileEvents,
      equipment,
      equipmentSets,
      coffeeBags,
      bagEvaluations,
      recipes,
      recipeMessages,
      brewLogs,
      tasteSuggestions,
      aiUsage,
      analyticsEvents,
    };
  },
});
