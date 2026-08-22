import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { AiUsageLog, ListFilter, ListResponse } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { fetchAiUsage } from '../services/aiUsageApi';

/** This account's own model usage, newest first. */
export const useAiUsage = (filter?: ListFilter): UseQueryResult<ListResponse<AiUsageLog>> =>
  useQuery({
    queryKey: QUERY_KEYS.aiUsage(filter),
    queryFn: async (): Promise<ListResponse<AiUsageLog>> => fetchAiUsage(filter),
  });
