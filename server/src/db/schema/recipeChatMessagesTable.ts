import type { RecipePatch } from '@brewmate/shared';
import { index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { chatRoleEnum } from './columnEnums.js';
import { recipesTable } from './recipesTable.js';
import { TABLE_NAMES } from './tableNames.js';

const RECIPE_CREATED_INDEX_NAME = 'recipe_chat_messages_recipe_created_idx';

/**
 * The conversation about one recipe.
 *
 * There is deliberately no `user_id` here. Ownership already lives on the
 * recipe, and a copy of it in this table would be a second source of truth
 * able to disagree with the first. The repository resolves the recipe for the
 * caller first and only then reads the messages: one extra query, and no way
 * for the two to drift apart.
 *
 * `recipe_patch` holds the change a message proposed, stored next to the
 * message rather than applied to the recipe - the conversation stays a record
 * of what was suggested even when the suggestion was ignored.
 */
export const recipeChatMessagesTable = pgTable(
  TABLE_NAMES.recipeChatMessages,
  {
    id: uuid('id').primaryKey().defaultRandom(),
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipesTable.id, { onDelete: 'cascade' }),
    role: chatRoleEnum('role').notNull(),
    content: text('content').notNull(),
    recipePatch: jsonb('recipe_patch').$type<RecipePatch>(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index(RECIPE_CREATED_INDEX_NAME).on(table.recipeId, table.createdAt)],
);

export type RecipeChatMessageRow = typeof recipeChatMessagesTable.$inferSelect;
export type NewRecipeChatMessageRow = typeof recipeChatMessagesTable.$inferInsert;
