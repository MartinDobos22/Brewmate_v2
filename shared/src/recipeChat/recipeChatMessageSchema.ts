import { z } from 'zod';

import { CHAT_ROLES } from '../enums/chatRoles.js';

import { CHAT_MESSAGE_MAX_LENGTH } from './recipeChatFieldLimits.js';
import { recipePatchSchema } from './recipePatchSchema.js';

/**
 * One message in the conversation about a recipe.
 *
 * There is deliberately no `userId` column: ownership already lives on the
 * recipe, and a copy of it here would be a second source of truth that can
 * disagree with the first. The repository resolves the recipe for the caller
 * before it touches the messages - one extra query, no chance of drift.
 */
export const recipeChatMessageSchema = z.object({
  id: z.uuid(),
  recipeId: z.uuid(),
  role: z.enum(CHAT_ROLES),
  content: z.string().min(1).max(CHAT_MESSAGE_MAX_LENGTH),
  recipePatch: recipePatchSchema.nullable(),
  createdAt: z.iso.datetime(),
});

export type RecipeChatMessage = z.infer<typeof recipeChatMessageSchema>;
