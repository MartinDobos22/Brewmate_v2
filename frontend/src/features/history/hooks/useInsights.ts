import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { InsightsResponse } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { fetchInsights } from '../services/insightsApi';

/**
 * What this account's brewing adds up to.
 *
 * An account with almost no history gets an empty report rather than an error:
 * having nothing to say yet is the ordinary state of this screen for the first
 * few weeks, and it says what would change that.
 */
export const useInsights = (): UseQueryResult<InsightsResponse> =>
  useQuery({
    queryKey: QUERY_KEYS.insights(),
    queryFn: fetchInsights,
  });
