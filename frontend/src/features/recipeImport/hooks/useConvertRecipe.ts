import type { UseMutationResult } from '@tanstack/react-query';
import {
  ANALYTICS_EVENT_NAMES,
  type ConvertRecipeRequest,
  type ConvertRecipeResponse,
} from '@brewmate/shared';

import { QUERY_ROOTS } from '../../../constants/queryKeys';
import { useInvalidatingMutation } from '../../../hooks/useEntityMutation';
import { convertRecipe } from '../services/recipeImportApi';

/**
 * Converts the recipe onto this person's equipment, and stores it.
 *
 * Every number worth showing is one the server computed, so there is nothing
 * to be optimistic about - and these are exactly the numbers this feature
 * exists to get right.
 */
export const useConvertRecipe = (): UseMutationResult<
  ConvertRecipeResponse,
  Error,
  ConvertRecipeRequest
> =>
  useInvalidatingMutation({
    mutationFn: convertRecipe,
    invalidates: [QUERY_ROOTS.recipes, QUERY_ROOTS.aiUsage],
    tracks: ANALYTICS_EVENT_NAMES.recipeImported,
  });
