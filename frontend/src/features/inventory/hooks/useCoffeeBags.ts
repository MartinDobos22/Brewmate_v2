import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { CoffeeBag, CoffeeBagFilter, ListResponse } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { fetchCoffeeBags } from '../services/coffeeBagsApi';

/** The coffee in the cupboard. Archived bags are left out unless asked for. */
export const useCoffeeBags = (filter?: CoffeeBagFilter): UseQueryResult<ListResponse<CoffeeBag>> =>
  useQuery({
    queryKey: QUERY_KEYS.coffeeBags(filter),
    queryFn: async (): Promise<ListResponse<CoffeeBag>> => fetchCoffeeBags(filter),
  });
