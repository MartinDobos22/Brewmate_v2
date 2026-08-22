import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { Recipe } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { fetchRecipe } from '../services/recipesApi';

export const useRecipe = (id: string | null): UseQueryResult<Recipe> =>
  useQuery({
    queryKey: QUERY_KEYS.recipe(id ?? ''),
    queryFn: async (): Promise<Recipe> => fetchRecipe(id ?? ''),
    enabled: id !== null,
  });
