import { z } from 'zod';

import { brewConstraintsSchema } from '../brewing/brewConstraintsSchema.js';
import { sourceRecipeSchema } from '../conversion/sourceRecipeSchema.js';
import { WATER_TYPES } from '../enums/waterTypes.js';
import { recipeSchema } from '../recipes/recipeSchema.js';

import { COFFEE_DESCRIPTION_MAX_LENGTH } from './aiFieldLimits.js';

/**
 * Body of `POST /ai/convert-recipe`.
 *
 * The source recipe travels whole, because by this point a person has looked
 * at it and corrected whatever was misread. Nothing about their own equipment
 * travels at all: the method, the set and the coffee are ids the API resolves
 * against the caller's own rows, exactly as the recipe engine does - a grinder
 * a client could declare is a grinder anybody could declare, and the whole
 * value of this conversion is that it was made for the collar actually sitting
 * on somebody's counter.
 *
 * `sourceGrinderId` is on the source recipe rather than here, because it is a
 * fact about where the recipe came from rather than about this person.
 */
export const convertRecipeRequestSchema = z
  .object({
    source: sourceRecipeSchema,
    /** The method they will actually brew it in, which may not be the source's. */
    methodId: z.uuid(),
    bagId: z.uuid().nullable().optional(),
    coffeeDescription: z.string().max(COFFEE_DESCRIPTION_MAX_LENGTH).nullable().optional(),
    equipmentSetId: z.uuid().nullable().optional(),
    constraints: brewConstraintsSchema,
    waterType: z.enum(WATER_TYPES),
  })
  .strict();

export type ConvertRecipeRequest = z.infer<typeof convertRecipeRequestSchema>;

/**
 * The converted recipe, already stored.
 *
 * The conversion report rides inside `recipe.params.conversion` rather than
 * beside it here. There is only one copy of it and it is the one that survives
 * being reopened next month, which matters more than usual for this feature:
 * a converted grind that has lost the sentence saying it is a starting point
 * has quietly become a measurement.
 */
export const convertRecipeResponseSchema = z.object({ recipe: recipeSchema });

export type ConvertRecipeResponse = z.infer<typeof convertRecipeResponseSchema>;
