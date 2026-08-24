import { z } from 'zod';

/**
 * Which line of recipes is being asked for.
 *
 * The pair (bag, method) rather than the coffee alone, because that is what a
 * recipe belongs to everywhere else in this product: the same beans want a
 * different dose in a V60 than in an AeroPress, and one flat list would invite
 * somebody to read one method's numbers as an improvement on another's.
 *
 * An absent `bagId` is not "any bag" - it is the quick-brew line, the recipes
 * written for beans that were never in the cupboard. That mirrors how pinning
 * already works, where a bagless recipe has its own uniqueness rule.
 */
export const recipeTimelineQuerySchema = z.object({
  methodId: z.uuid(),
  bagId: z.uuid().optional(),
});

export type RecipeTimelineQuery = z.infer<typeof recipeTimelineQuerySchema>;
