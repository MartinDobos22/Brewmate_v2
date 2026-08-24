import {
  RECIPE_SOURCES,
  applyRecipePatch,
  type CreateRecipeRequest,
  type Recipe,
  type RecipePatch,
} from '@brewmate/shared';

/**
 * The proposal, taken.
 *
 * A new recipe rather than an edit of the old one, pointing back at it through
 * `parentRecipeId`. That is the whole reason the chain exists: the recipe
 * somebody actually brewed stays exactly as it was, so a brew log still
 * describes the cup it came from, and the next conversation can read how the
 * numbers got here rather than only where they ended up.
 *
 * The source is `adjusted` because that is what happened - somebody said how a
 * cup tasted and the recipe moved. Not `ai`: the model proposed it, but
 * nothing was applied until a person tapped.
 */
export const buildAdjustedRecipe = (recipe: Recipe, patch: RecipePatch): CreateRecipeRequest => ({
  bagId: recipe.bagId,
  methodId: recipe.methodId,
  equipmentIds: recipe.equipmentIds,
  params: applyRecipePatch(recipe.params, patch),
  rationale: patch.rationale ?? recipe.rationale,
  source: RECIPE_SOURCES.adjusted,
  parentRecipeId: recipe.id,
  isSaved: recipe.isSaved,
  isPinned: false,
});
