import type { TasteProfileDelta, TasteProfileEventPayload } from '@brewmate/shared';
import { isNotNull } from 'drizzle-orm';
import { index, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tasteProfileSourceEnum } from './columnEnums.js';
import { TABLE_NAMES } from './tableNames.js';
import { usersTable } from './usersTable.js';

const USER_CREATED_INDEX_NAME = 'taste_profile_events_user_created_idx';
const SOURCE_REF_INDEX_NAME = 'taste_profile_events_source_ref_unique_idx';

/**
 * The append-only audit trail behind every taste profile.
 *
 * Nothing updates or deletes a row here. The profile is rebuilt by folding
 * these in `created_at` order through a pure reducer, so a recompute is
 * reproducible and can be diffed against `applied_delta`, which records what
 * the reducer actually did at the time.
 *
 * `source_ref` is what makes that fold idempotent in practice: it names the
 * thing that caused the event - a brew log id, a questionnaire version - and
 * the partial unique index below means submitting the same questionnaire twice
 * cannot count the same preferences twice.
 */
export const tasteProfileEventsTable = pgTable(
  TABLE_NAMES.tasteProfileEvents,
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    source: tasteProfileSourceEnum('source').notNull(),
    sourceRef: text('source_ref'),
    payload: jsonb('payload').$type<TasteProfileEventPayload>().notNull(),
    appliedDelta: jsonb('applied_delta').$type<TasteProfileDelta>(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index(USER_CREATED_INDEX_NAME).on(table.userId, table.createdAt),
    uniqueIndex(SOURCE_REF_INDEX_NAME)
      .on(table.userId, table.source, table.sourceRef)
      .where(isNotNull(table.sourceRef)),
  ],
);

export type TasteProfileEventRow = typeof tasteProfileEventsTable.$inferSelect;
export type NewTasteProfileEventRow = typeof tasteProfileEventsTable.$inferInsert;
