import type { UseMutationResult } from '@tanstack/react-query';
import type { Recipe, UpdateRecipeRequest } from '@brewmate/shared';

import { QUERY_KEYS, QUERY_ROOTS } from '../../../constants/queryKeys';
import { useOptimisticEntityMutation } from '../../../hooks/useEntityMutation';
import { updateRecipe } from '../services/recipesApi';

export interface UpdateRecipeVariables {
  readonly id: string;
  readonly changes: UpdateRecipeRequest;
}

/**
 * Edits a recipe optimistically.
 *
 * The change shown is the one the caller made to this recipe. When it takes
 * the pin, the recipe that had it before is corrected by the settling refetch
 * rather than guessed at here - the app knows what it asked for, not what the
 * rest of the pair looks like afterwards.
 */
export const useUpdateRecipe = (): UseMutationResult<Recipe, Error, UpdateRecipeVariables> =>
  useOptimisticEntityMutation<UpdateRecipeVariables, Recipe>({
    mutationFn: async ({ id, changes }: UpdateRecipeVariables): Promise<Recipe> =>
      updateRecipe(id, changes),
    entityId: ({ id }: UpdateRecipeVariables): string => id,
    detailKey: ({ id }: UpdateRecipeVariables) => QUERY_KEYS.recipe(id),
    listRoot: QUERY_ROOTS.recipes,
    optimisticPatch: ({ changes }: UpdateRecipeVariables): Partial<Recipe> => changes,
  });
