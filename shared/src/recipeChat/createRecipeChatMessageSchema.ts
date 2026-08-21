import { z } from 'zod';

import { CHAT_ROLES } from '../enums/chatRoles.js';

import { CHAT_MESSAGE_MAX_LENGTH } from './recipeChatFieldLimits.js';
import { recipePatchSchema } from './recipePatchSchema.js';

/** Body of `POST /recipes/:id/messages`. */
export const createRecipeChatMessageRequestSchema = z
  .object({
    role: z.enum(CHAT_ROLES),
    content: z.string().min(1).max(CHAT_MESSAGE_MAX_LENGTH),
    recipePatch: recipePatchSchema.nullable().optional(),
  })
  .strict();

export type CreateRecipeChatMessageRequest = z.infer<typeof createRecipeChatMessageRequestSchema>;
