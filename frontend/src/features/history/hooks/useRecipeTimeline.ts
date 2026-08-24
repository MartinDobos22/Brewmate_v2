import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { RecipeTimeline } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { fetchRecipeTimeline } from '../services/historyApi';

export interface RecipeTimelineArgs {
  readonly methodId: string | undefined;
  readonly bagId: string | undefined;
}

/**
 * One recipe line, or nothing while the route has not said which.
 *
 * The query is disabled rather than defaulted, because there is no sensible
 * default: every recipe belongs to a pair, and asking for "some method" would
 * answer with a history that is not anybody's.
 */
export const useRecipeTimeline = ({
  methodId,
  bagId,
}: RecipeTimelineArgs): UseQueryResult<RecipeTimeline> =>
  useQuery({
    queryKey: QUERY_KEYS.recipeTimeline(methodId ?? '', bagId),
    enabled: methodId !== undefined,
    queryFn: async (): Promise<RecipeTimeline> =>
      fetchRecipeTimeline({ methodId: methodId ?? '', bagId }),
  });
