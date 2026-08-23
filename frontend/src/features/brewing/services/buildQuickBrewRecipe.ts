import { RECIPE_SOURCES, type CreateRecipeRequest } from '@brewmate/shared';

import { buildReferenceParams, type ReferenceRecipeInput } from './buildReferenceRecipe';

/**
 * A quick brew, as the API takes it.
 *
 * `bagId` is deliberately absent, which stores as null: this is a cup made
 * from beans that are not in the cupboard, and requiring them to be there
 * first would make the app something to fill in rather than something to brew
 * with.
 *
 * The source is `calibration` because that is what this recipe is - the plain
 * reference cup for the gear and the little that was said about the coffee. It
 * is not `manual`: nobody typed these numbers, and it is not `ai`, because
 * nothing here was inferred by a model.
 */
export const buildQuickBrewRecipe = (
  input: ReferenceRecipeInput,
  rationale: string,
): CreateRecipeRequest => ({
  methodId: input.method.id,
  equipmentIds: input.brewer === undefined ? [] : [input.brewer.id],
  params: buildReferenceParams(input),
  rationale,
  source: RECIPE_SOURCES.calibration,
});
