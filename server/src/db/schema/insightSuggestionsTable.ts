import { SUGGESTION_REF_MAX_LENGTH } from '@brewmate/shared';
import { index, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';

import { TABLE_NAMES } from './tableNames.js';
import { usersTable } from './usersTable.js';

const USER_REF_INDEX_NAME = 'insight_suggestions_user_ref_unique_idx';
const USER_CREATED_INDEX_NAME = 'insight_suggestions_user_created_idx';

/**
 * Every suggestion this account has been shown, and what became of it.
 *
 * The row is keyed by `suggestion_ref`, which fingerprints the counts the
 * proposal was drawn from rather than the proposal itself. That one decision
 * does three jobs.
 *
 * It makes the sentence beside the numbers free after the first time. The
 * arithmetic is done in code and costs nothing, but putting it into Slovak is
 * a model call, and a screen that re-wrote the same paragraph every time
 * somebody opened it would be paying for the same sentence all month. This is
 * the same bargain `coffee_bag_parses` strikes, and the same one a stored shop
 * verdict strikes: advice that comes out differently every time it is asked
 * for is advice nobody can rely on.
 *
 * It makes refusing meaningful but not permanent. `dismissed_at` hides this
 * evidence, not the subject: brew another dozen coffees and the counts change,
 * the fingerprint changes, and the app is free to ask again. Somebody who said
 * no after six brews is entitled to be asked again after thirty.
 *
 * And it makes accepting count once. `accepted_at` is the record; the taste
 * event itself carries the same ref as its `source_ref`, so the partial unique
 * index on the audit trail refuses a second one even if this row were lost.
 *
 * The row survives the coffee it was drawn from - there is no reference to a
 * bag here on purpose. What is stored is a conclusion about a person's
 * history, and it has to stay readable after a bag is archived.
 */
export const insightSuggestionsTable = pgTable(
  TABLE_NAMES.insightSuggestions,
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    suggestionRef: varchar('suggestion_ref', { length: SUGGESTION_REF_MAX_LENGTH }).notNull(),
    /** Null until a model has put the finished arithmetic into a sentence. */
    explanation: text('explanation'),
    dismissedAt: timestamp('dismissed_at', { withTimezone: true }),
    acceptedAt: timestamp('accepted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex(USER_REF_INDEX_NAME).on(table.userId, table.suggestionRef),
    index(USER_CREATED_INDEX_NAME).on(table.userId, table.createdAt.desc()),
  ],
);

export type InsightSuggestionRow = typeof insightSuggestionsTable.$inferSelect;
export type NewInsightSuggestionRow = typeof insightSuggestionsTable.$inferInsert;
