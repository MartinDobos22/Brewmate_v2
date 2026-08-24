import { z } from 'zod';

import { brewLogSchema } from '../brewLogs/brewLogSchema.js';
import { recipeChatMessageSchema } from '../recipeChat/recipeChatMessageSchema.js';
import { recipeSchema } from '../recipes/recipeSchema.js';

/**
 * One version of a recipe, with everything that happened to it.
 *
 * The cups and the notes hang off the version they belong to rather than
 * sitting in one list beside it, because the question this screen answers is
 * "what did changing that do?" - and an answer needs the change and its
 * consequences in the same place.
 *
 * `messageCount` and `brewCount` are the true totals; the arrays are capped.
 * A version that carries thirty notes says so rather than quietly showing
 * twenty and letting somebody conclude the other ten never existed.
 */
export const recipeTimelineEntrySchema = z.object({
  recipe: recipeSchema,
  brews: z.array(brewLogSchema),
  brewCount: z.number().int().nonnegative(),
  messages: z.array(recipeChatMessageSchema),
  messageCount: z.number().int().nonnegative(),
  /** True where any cup of this version was brewed with something missing. */
  hasConstrainedBrew: z.boolean(),
});

export type RecipeTimelineEntry = z.infer<typeof recipeTimelineEntrySchema>;

/**
 * The whole line, oldest version first.
 *
 * Oldest first because it is read as a story: this is where the numbers
 * started, this is what was said about them, this is where they went.
 */
export const recipeTimelineSchema = z.object({
  methodId: z.uuid(),
  bagId: z.uuid().nullable(),
  entries: z.array(recipeTimelineEntrySchema),
});

export type RecipeTimeline = z.infer<typeof recipeTimelineSchema>;
