import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { ListFilter, ListResponse, RecipeChatMessage } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { fetchRecipeMessages } from '../services/recipeChatApi';

/** The conversation about one recipe. Reading it requires owning the recipe. */
export const useRecipeMessages = (
  recipeId: string | null,
  filter?: ListFilter,
): UseQueryResult<ListResponse<RecipeChatMessage>> =>
  useQuery({
    queryKey: QUERY_KEYS.recipeMessages(recipeId ?? '', filter),
    queryFn: async (): Promise<ListResponse<RecipeChatMessage>> =>
      fetchRecipeMessages(recipeId ?? '', filter),
    enabled: recipeId !== null,
  });
