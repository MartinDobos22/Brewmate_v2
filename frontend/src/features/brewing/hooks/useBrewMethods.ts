import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { BrewMethod, BrewMethodFilter, ListResponse } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { fetchBrewMethods } from '../services/brewMethodsApi';

/** The method catalogue. Retired methods are left out unless asked for. */
export const useBrewMethods = (
  filter?: BrewMethodFilter,
): UseQueryResult<ListResponse<BrewMethod>> =>
  useQuery({
    queryKey: QUERY_KEYS.brewMethods(filter),
    queryFn: async (): Promise<ListResponse<BrewMethod>> => fetchBrewMethods(filter),
  });
