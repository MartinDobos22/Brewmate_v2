import { z } from 'zod';

import { RECIPE_SOURCES } from '../enums/recipeSources.js';

import { recipeSchema } from './recipeSchema.js';

/**
 * Body of `POST /recipes`.
 *
 * A recipe posted without saying where it came from is one somebody typed in,
 * so `source` defaults to `manual` rather than being nullable - every recipe
 * has a provenance, and "unknown" is not one of them.
 */
export const createRecipeRequestSchema = recipeSchema
  .omit({ id: true, userId: true, createdAt: true, updatedAt: true })
  .partial()
  .required({ methodId: true, params: true })
  .extend({ source: z.enum(RECIPE_SOURCES).default(RECIPE_SOURCES.manual) })
  .strict();

export type CreateRecipeRequest = z.infer<typeof createRecipeRequestSchema>;
