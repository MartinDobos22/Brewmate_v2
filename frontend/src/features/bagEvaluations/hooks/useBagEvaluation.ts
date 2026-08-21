import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { BagEvaluation } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { fetchBagEvaluation } from '../services/bagEvaluationsApi';

export const useBagEvaluation = (id: string | null): UseQueryResult<BagEvaluation> =>
  useQuery({
    queryKey: QUERY_KEYS.bagEvaluation(id ?? ''),
    queryFn: async (): Promise<BagEvaluation> => fetchBagEvaluation(id ?? ''),
    enabled: id !== null,
  });
