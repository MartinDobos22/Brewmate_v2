import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { ListResponse, Recipe, RecipeFilter } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { fetchRecipes } from '../services/recipesApi';

const ALWAYS = true;

/**
 * Recipes, pinned ones first. Filter by bag, by method, or by both.
 *
 * `enabled` is for the callers whose filter is not known yet. A filter built
 * from a bag nobody has picked would go out as a request for every recipe the
 * account owns, and answer a question nothing on the screen asked.
 */
export const useRecipes = (
  filter?: RecipeFilter,
  enabled: boolean = ALWAYS,
): UseQueryResult<ListResponse<Recipe>> =>
  useQuery({
    queryKey: QUERY_KEYS.recipes(filter),
    queryFn: async (): Promise<ListResponse<Recipe>> => fetchRecipes(filter),
    enabled,
  });
