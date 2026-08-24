import type { AnalyticsProperties } from '@brewmate/shared';
import { index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { TABLE_NAMES } from './tableNames.js';
import { usersTable } from './usersTable.js';

const USER_OCCURRED_INDEX_NAME = 'analytics_events_user_occurred_idx';
const NAME_OCCURRED_INDEX_NAME = 'analytics_events_name_occurred_idx';
const NO_PROPERTIES: AnalyticsProperties = {};

/**
 * One step of a flow that somebody reached.
 *
 * `user_id` is on the row and cascades like everything else an account owns,
 * which is the only honest way to hold this: an event tied to a person is
 * personal data whatever it is called, so it is deleted with the account and
 * included in the export. A separate "anonymous" analytics store with a device
 * id in it would be the same data wearing a different name, and neither
 * deletable nor exportable.
 *
 * `occurred_at` is the phone's clock and `created_at` is the server's. Both,
 * because these are queued while offline and flushed later: stamping only on
 * arrival would report a morning's brewing as having happened all at once that
 * evening, and trusting only the phone would leave a wrong device clock
 * unnoticeable.
 *
 * `name` is text rather than an enum. The list of interesting flows changes
 * faster than the schema should, retiring one must not orphan its history, and
 * nothing in the application branches on the value - it is grouped by, and
 * that is all.
 */
export const analyticsEventsTable = pgTable(
  TABLE_NAMES.analyticsEvents,
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    properties: jsonb('properties').$type<AnalyticsProperties>().notNull().default(NO_PROPERTIES),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index(USER_OCCURRED_INDEX_NAME).on(table.userId, table.occurredAt.desc()),
    index(NAME_OCCURRED_INDEX_NAME).on(table.name, table.occurredAt.desc()),
  ],
);

export type AnalyticsEventRow = typeof analyticsEventsTable.$inferSelect;
export type NewAnalyticsEventRow = typeof analyticsEventsTable.$inferInsert;
