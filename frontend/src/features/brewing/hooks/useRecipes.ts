import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { ListResponse, Recipe, RecipeFilter } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { fetchRecipes } from '../services/recipesApi';

/** Recipes, pinned ones first. Filter by bag, by method, or by both. */
export const useRecipes = (filter?: RecipeFilter): UseQueryResult<ListResponse<Recipe>> =>
  useQuery({
    queryKey: QUERY_KEYS.recipes(filter),
    queryFn: async (): Promise<ListResponse<Recipe>> => fetchRecipes(filter),
  });
