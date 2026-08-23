import type { Recipe } from '@brewmate/shared';

export interface RecipeMethodGroup {
  readonly methodId: string;
  readonly recipes: readonly Recipe[];
}

/**
 * One coffee's recipes, split by the way they were brewed.
 *
 * Split rather than listed flat because a recipe belongs to the pair (bag,
 * method), not to the coffee: the same beans want a different dose in a V60
 * than in an AeroPress, and a single list would invite somebody to read one
 * method's numbers as an improvement on another's.
 *
 * The order the API sent them in is preserved - pinned first - so the recipe
 * somebody settled on stays at the top of its own group.
 */
export const groupRecipesByMethod = (recipes: readonly Recipe[]): readonly RecipeMethodGroup[] => {
  const groups = new Map<string, Recipe[]>();

  for (const recipe of recipes) {
    const existing = groups.get(recipe.methodId);

    if (existing === undefined) {
      groups.set(recipe.methodId, [recipe]);

      continue;
    }

    existing.push(recipe);
  }

  return [...groups].map(
    ([methodId, grouped]: readonly [string, readonly Recipe[]]): RecipeMethodGroup => ({
      methodId,
      recipes: grouped,
    }),
  );
};
