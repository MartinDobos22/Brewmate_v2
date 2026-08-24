import type { RoastLevel } from '@brewmate/shared';
import { and, desc, eq, isNotNull, type SQL } from 'drizzle-orm';

import type { Database } from '../../db/databaseTypes.js';
import { requireRow } from '../../db/rows/requireRow.js';
import { brewLogsTable } from '../../db/schema/brewLogsTable.js';
import { coffeeBagsTable } from '../../db/schema/coffeeBagsTable.js';
import { insightSuggestionsTable } from '../../db/schema/insightSuggestionsTable.js';
import type { InsightSuggestionRow } from '../../db/schema/insightSuggestionsTable.js';
import { recipesTable } from '../../db/schema/recipesTable.js';

import { INSIGHT_HISTORY_LIMIT, INSIGHT_PINNED_LIMIT } from './constants/insightLimits.js';

const PINNED = true;

/**
 * One cup, described by the coffee it was made from.
 *
 * Only the columns the report counts, and the weight that cup was priced at on
 * the way in. Reading the whole brew log and the whole bag would carry a pour
 * schedule and a farm name through a query whose entire job is to tally three
 * fields.
 */
export interface BrewHistoryRow {
  readonly bagId: string;
  readonly originCountry: string | null;
  readonly process: string | null;
  readonly roastLevel: RoastLevel | null;
  readonly tastingNotes: readonly string[];
  readonly learningWeight: number;
}

/** A version somebody went back to, described the same way. */
export interface PinnedRecipeRow {
  readonly bagId: string;
  readonly originCountry: string | null;
  readonly process: string | null;
  readonly roastLevel: RoastLevel | null;
}

export interface InsightsRepository {
  listBrewHistory(userId: string): Promise<readonly BrewHistoryRow[]>;
  listPinnedRecipes(userId: string): Promise<readonly PinnedRecipeRow[]>;
  findSuggestion(userId: string, ref: string): Promise<InsightSuggestionRow | null>;
  /** Records that this evidence has been shown; returns the row either way. */
  rememberSuggestion(userId: string, ref: string): Promise<InsightSuggestionRow>;
  saveExplanation(userId: string, ref: string, explanation: string): Promise<void>;
  markDismissed(userId: string, ref: string, at: Date): Promise<InsightSuggestionRow | null>;
  markAccepted(userId: string, ref: string, at: Date): Promise<InsightSuggestionRow | null>;
}

const ownedRef = (userId: string, ref: string): SQL | undefined =>
  and(eq(insightSuggestionsTable.userId, userId), eq(insightSuggestionsTable.suggestionRef, ref));

const firstOrNull = (rows: readonly InsightSuggestionRow[]): InsightSuggestionRow | null =>
  rows[0] ?? null;

export const createInsightsRepository = (db: Database): InsightsRepository => ({
  /**
   * An inner join, so a quick brew with no bag behind it simply is not here.
   * Those cups happened and are in the history the app shows; they just cannot
   * tell anybody anything about origins, because nobody wrote down what was in
   * the grinder.
   */
  listBrewHistory: async (userId) =>
    db
      .select({
        bagId: coffeeBagsTable.id,
        originCountry: coffeeBagsTable.originCountry,
        process: coffeeBagsTable.process,
        roastLevel: coffeeBagsTable.roastLevel,
        tastingNotes: coffeeBagsTable.tastingNotes,
        learningWeight: brewLogsTable.profileLearningWeight,
      })
      .from(brewLogsTable)
      .innerJoin(coffeeBagsTable, eq(brewLogsTable.bagId, coffeeBagsTable.id))
      .where(eq(brewLogsTable.userId, userId))
      .orderBy(desc(brewLogsTable.createdAt))
      .limit(INSIGHT_HISTORY_LIMIT),

  listPinnedRecipes: async (userId) =>
    db
      .select({
        bagId: coffeeBagsTable.id,
        originCountry: coffeeBagsTable.originCountry,
        process: coffeeBagsTable.process,
        roastLevel: coffeeBagsTable.roastLevel,
      })
      .from(recipesTable)
      .innerJoin(coffeeBagsTable, eq(recipesTable.bagId, coffeeBagsTable.id))
      .where(
        and(
          eq(recipesTable.userId, userId),
          eq(recipesTable.isPinned, PINNED),
          isNotNull(recipesTable.bagId),
        ),
      )
      .limit(INSIGHT_PINNED_LIMIT),

  findSuggestion: async (userId, ref) =>
    firstOrNull(await db.select().from(insightSuggestionsTable).where(ownedRef(userId, ref))),

  /**
   * An upsert that changes nothing on conflict, then a read.
   *
   * `do nothing` returns no row, so the read afterwards is what makes this
   * total - and two requests racing on the first open of a screen both end up
   * looking at the same row instead of one of them failing on the unique
   * index.
   */
  rememberSuggestion: async (userId, ref): Promise<InsightSuggestionRow> => {
    const inserted = await db
      .insert(insightSuggestionsTable)
      .values({ userId, suggestionRef: ref })
      .onConflictDoNothing()
      .returning();

    const created = firstOrNull(inserted);

    if (created !== null) {
      return created;
    }

    /** Nothing was inserted, so a row already exists - this one or a racing one. */
    return requireRow(await db.select().from(insightSuggestionsTable).where(ownedRef(userId, ref)));
  },

  saveExplanation: async (userId, ref, explanation): Promise<void> => {
    await db.update(insightSuggestionsTable).set({ explanation }).where(ownedRef(userId, ref));
  },

  markDismissed: async (userId, ref, at) =>
    firstOrNull(
      await db
        .update(insightSuggestionsTable)
        .set({ dismissedAt: at })
        .where(ownedRef(userId, ref))
        .returning(),
    ),

  markAccepted: async (userId, ref, at) =>
    firstOrNull(
      await db
        .update(insightSuggestionsTable)
        .set({ acceptedAt: at })
        .where(ownedRef(userId, ref))
        .returning(),
    ),
});
