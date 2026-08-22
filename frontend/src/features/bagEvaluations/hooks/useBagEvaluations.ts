import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { BagEvaluation, ListFilter, ListResponse } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { fetchBagEvaluations } from '../services/bagEvaluationsApi';

/** Every bag that was ever weighed up in a shop, newest first. */
export const useBagEvaluations = (
  filter?: ListFilter,
): UseQueryResult<ListResponse<BagEvaluation>> =>
  useQuery({
    queryKey: QUERY_KEYS.bagEvaluations(filter),
    queryFn: async (): Promise<ListResponse<BagEvaluation>> => fetchBagEvaluations(filter),
  });
