import type { UseMutationResult } from '@tanstack/react-query';
import type { GenerateRecipeRequest, GenerateRecipeResponse } from '@brewmate/shared';

import { QUERY_ROOTS } from '../../../constants/queryKeys';
import { useInvalidatingMutation } from '../../../hooks/useEntityMutation';
import { generateRecipe } from '../services/recipeEngineApi';

/**
 * Asks the engine for a recipe.
 *
 * Never optimistic, and it is the clearest case in the app for why that line
 * exists: every number worth showing here is one the server is about to
 * compute. Drawing a guessed grind setting and then replacing it a second
 * later would be showing somebody a number that is about to change - and these
 * are exactly the numbers this product exists to get right.
 */
export const useGenerateRecipe = (): UseMutationResult<
  GenerateRecipeResponse,
  Error,
  GenerateRecipeRequest
> =>
  useInvalidatingMutation({
    mutationFn: generateRecipe,
    invalidates: [QUERY_ROOTS.recipes, QUERY_ROOTS.aiUsage],
  });
