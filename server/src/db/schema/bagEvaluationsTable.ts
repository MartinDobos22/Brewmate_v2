import type { EvaluationReasoning, EvaluationUncertainties, ParsedBagData } from '@brewmate/shared';
import { boolean, index, jsonb, pgTable, real, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { coffeeBagsTable } from './coffeeBagsTable.js';
import { TABLE_NAMES } from './tableNames.js';
import { usersTable } from './usersTable.js';

const USER_CREATED_INDEX_NAME = 'bag_evaluations_user_created_idx';
const LINKED_BAG_INDEX_NAME = 'bag_evaluations_linked_bag_idx';
const NO_PARSED_DATA: ParsedBagData = {};
const NO_REASONING: EvaluationReasoning = { points: [] };
const NO_UNCERTAINTIES: EvaluationUncertainties = { items: [] };

/**
 * "Should I buy this bag?", asked in a shop and answered.
 *
 * `profile_confidence_at_time` is stored rather than looked up later: the
 * answer was only as good as what Brewmate knew that afternoon, and reading
 * today's confidence would silently rewrite how much that advice was worth.
 *
 * `was_purchased` and `linked_bag_id` are how the app eventually finds out
 * whether the advice was any good.
 */
export const bagEvaluationsTable = pgTable(
  TABLE_NAMES.bagEvaluations,
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    imageUrl: text('image_url'),
    parsedData: jsonb('parsed_data').$type<ParsedBagData>().notNull().default(NO_PARSED_DATA),
    verdictText: text('verdict_text'),
    reasoning: jsonb('reasoning').$type<EvaluationReasoning>().notNull().default(NO_REASONING),
    uncertainties: jsonb('uncertainties')
      .$type<EvaluationUncertainties>()
      .notNull()
      .default(NO_UNCERTAINTIES),
    profileConfidenceAtTime: real('profile_confidence_at_time'),
    wasPurchased: boolean('was_purchased'),
    linkedBagId: uuid('linked_bag_id').references(() => coffeeBagsTable.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index(USER_CREATED_INDEX_NAME).on(table.userId, table.createdAt.desc()),
    index(LINKED_BAG_INDEX_NAME).on(table.linkedBagId),
  ],
);

export type BagEvaluationRow = typeof bagEvaluationsTable.$inferSelect;
export type NewBagEvaluationRow = typeof bagEvaluationsTable.$inferInsert;
