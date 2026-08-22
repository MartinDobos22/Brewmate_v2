import type { RecipeChatMessage } from '@brewmate/shared';

import type { RecipeChatMessageRow } from '../../db/schema/recipeChatMessagesTable.js';

/** Converts a database row into the shape declared by the shared contract. */
export const toRecipeChatMessage = (row: RecipeChatMessageRow): RecipeChatMessage => ({
  id: row.id,
  recipeId: row.recipeId,
  role: row.role,
  content: row.content,
  recipePatch: row.recipePatch ?? null,
  createdAt: row.createdAt.toISOString(),
});
