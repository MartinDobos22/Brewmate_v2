import { z } from 'zod';

import { brewParamsSchema } from '../brewing/brewParamsSchema.js';
import { RECIPE_SOURCES } from '../enums/recipeSources.js';

import { RECIPE_EQUIPMENT_IDS_MAX, RECIPE_RATIONALE_MAX_LENGTH } from './recipeFieldLimits.js';

/**
 * One way of brewing one coffee.
 *
 * A recipe belongs to the *pair* (bag, method), not to the coffee: the same
 * beans want different treatment in a V60 than in an AeroPress, so a pinned
 * recipe is unique per pair. `bagId` is nullable for a quick brew with beans
 * that are not in the inventory - and because SQL considers two NULLs
 * distinct, that case needs its own uniqueness rule rather than sharing one.
 *
 * `parentRecipeId` records where an adjustment came from. Deleting an ancestor
 * nulls the link instead of cascading, so one tidy-up cannot take a whole tree
 * of refinements with it.
 */
export const recipeSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  bagId: z.uuid().nullable(),
  methodId: z.uuid(),
  equipmentIds: z.array(z.uuid()).max(RECIPE_EQUIPMENT_IDS_MAX),
  params: brewParamsSchema,
  rationale: z.string().max(RECIPE_RATIONALE_MAX_LENGTH).nullable(),
  source: z.enum(RECIPE_SOURCES),
  parentRecipeId: z.uuid().nullable(),
  isSaved: z.boolean(),
  isPinned: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Recipe = z.infer<typeof recipeSchema>;
