import type { UseMutationResult } from '@tanstack/react-query';
import type { CreateRecipeRequest, Recipe } from '@brewmate/shared';

import { QUERY_ROOTS } from '../../../constants/queryKeys';
import { useInvalidatingMutation } from '../../../hooks/useEntityMutation';
import { createRecipe } from '../services/recipesApi';

/**
 * Adds a recipe.
 *
 * Not optimistic: the API validates the bag, the method and every piece of
 * equipment named, and pinning at creation releases whichever recipe held the
 * pin for that (bag, method) pair. None of that is the app's to assume.
 */
export const useCreateRecipe = (): UseMutationResult<Recipe, Error, CreateRecipeRequest> =>
  useInvalidatingMutation({
    mutationFn: createRecipe,
    invalidates: [QUERY_ROOTS.recipes],
  });
