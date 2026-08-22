import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { BrewLog, BrewLogFilter, ListResponse } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { fetchBrewLogs } from '../services/brewLogsApi';

/** The brewing history, newest first. */
export const useBrewLogs = (filter?: BrewLogFilter): UseQueryResult<ListResponse<BrewLog>> =>
  useQuery({
    queryKey: QUERY_KEYS.brewLogs(filter),
    queryFn: async (): Promise<ListResponse<BrewLog>> => fetchBrewLogs(filter),
  });
