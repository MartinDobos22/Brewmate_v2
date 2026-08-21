import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { Grinder, GrinderFilter, ListResponse } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { fetchGrinders } from '../services/grindersApi';

/**
 * The grinder catalogue: everything verified, plus whatever this user
 * contributed themselves.
 */
export const useGrinders = (filter?: GrinderFilter): UseQueryResult<ListResponse<Grinder>> =>
  useQuery({
    queryKey: QUERY_KEYS.grinders(filter),
    queryFn: async (): Promise<ListResponse<Grinder>> => fetchGrinders(filter),
  });
