import { z } from 'zod';

import { CHAT_MESSAGE_MAX_LENGTH } from '../recipeChat/recipeChatFieldLimits.js';
import { recipeChatMessageSchema } from '../recipeChat/recipeChatMessageSchema.js';

/**
 * Body of `POST /ai/recipe-chat`.
 *
 * The message and the recipe it is about, and nothing else. The coffee, the
 * method, the gear, the water, the constraints of that particular brew and the
 * last few versions of the recipe are all read off the caller's own rows - the
 * app is not asked to assemble the context it wants an answer about.
 *
 * `brewLogId` is what makes the answer about a cup rather than about a recipe.
 * It carries the constraints the brew was actually made under, which decide
 * both what the model may suggest changing and how much what the drinker says
 * afterwards is allowed to teach the profile.
 */
export const recipeChatRequestSchema = z
  .object({
    recipeId: z.uuid(),
    message: z.string().min(1).max(CHAT_MESSAGE_MAX_LENGTH),
    brewLogId: z.uuid().nullable().optional(),
  })
  .strict();

export type RecipeChatRequest = z.infer<typeof recipeChatRequestSchema>;

/**
 * Both halves of the exchange, as they were stored.
 *
 * The user's own message comes back too, rather than being echoed from what
 * the app already has. It is written on the server - one round trip instead of
 * two, and no way for a message to reach the model without reaching the
 * conversation - so the id the app draws it under is the real one.
 *
 * The proposal, when there is one, rides on `assistantMessage.recipePatch`: it
 * is stored next to the sentence that argued for it, so a suggestion nobody
 * took is still part of the record.
 */
export const recipeChatResponseSchema = z.object({
  userMessage: recipeChatMessageSchema,
  assistantMessage: recipeChatMessageSchema,
});

export type RecipeChatResponse = z.infer<typeof recipeChatResponseSchema>;
