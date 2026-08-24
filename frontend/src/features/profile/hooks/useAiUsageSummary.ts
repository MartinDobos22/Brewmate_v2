import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { AiUsageSummary } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { fetchAiUsageSummary } from '../services/aiUsageApi';

/**
 * What this account has spent, and what it may still spend.
 *
 * Read from the same rows the API's own limiter reads, so the number on the
 * screen and the number that refuses somebody's next scan cannot disagree.
 */
export const useAiUsageSummary = (): UseQueryResult<AiUsageSummary> =>
  useQuery({
    queryKey: QUERY_KEYS.aiUsageSummary(),
    queryFn: fetchAiUsageSummary,
  });
