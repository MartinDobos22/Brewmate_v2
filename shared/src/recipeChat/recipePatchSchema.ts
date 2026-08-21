import { z } from 'zod';

import { partialBrewParamsSchema } from '../brewing/brewParamsSchema.js';
import { RECIPE_RATIONALE_MAX_LENGTH } from '../recipes/recipeFieldLimits.js';

/**
 * The change a message proposes to the recipe it is attached to.
 *
 * Stored next to the message rather than applied to the recipe, so the
 * conversation stays a record of what was suggested even when the suggestion
 * was ignored.
 */
export const recipePatchSchema = z.object({
  params: partialBrewParamsSchema,
  rationale: z.string().max(RECIPE_RATIONALE_MAX_LENGTH).nullable().optional(),
});

export type RecipePatch = z.infer<typeof recipePatchSchema>;
