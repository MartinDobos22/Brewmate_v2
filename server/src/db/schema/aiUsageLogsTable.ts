import { AI_COST_PRECISION, AI_COST_SCALE } from '@brewmate/shared';
import { index, integer, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { TABLE_NAMES } from './tableNames.js';
import { usersTable } from './usersTable.js';

const USER_CREATED_INDEX_NAME = 'ai_usage_logs_user_created_idx';
const FUNCTION_CREATED_INDEX_NAME = 'ai_usage_logs_function_created_idx';
const NO_TOKENS = 0;

/**
 * One model call, recorded for cost.
 *
 * `cost_estimate` is `numeric` and travels as a decimal string - the one place
 * in this schema where exactness beats convenience. Everything else here is a
 * measurement, but these rows get summed over months, and a float sum of
 * fractions of a cent is wrong in the way nobody notices until the invoice.
 *
 * Written by server services only; there is no endpoint that lets a client
 * declare its own token usage.
 */
export const aiUsageLogsTable = pgTable(
  TABLE_NAMES.aiUsageLogs,
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    functionName: text('function_name').notNull(),
    model: text('model').notNull(),
    tokensIn: integer('tokens_in').notNull().default(NO_TOKENS),
    tokensOut: integer('tokens_out').notNull().default(NO_TOKENS),
    costEstimate: numeric('cost_estimate', {
      precision: AI_COST_PRECISION,
      scale: AI_COST_SCALE,
    }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index(USER_CREATED_INDEX_NAME).on(table.userId, table.createdAt.desc()),
    index(FUNCTION_CREATED_INDEX_NAME).on(table.functionName, table.createdAt.desc()),
  ],
);

export type AiUsageLogRow = typeof aiUsageLogsTable.$inferSelect;
export type NewAiUsageLogRow = typeof aiUsageLogsTable.$inferInsert;
