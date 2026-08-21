import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { CoffeeBag } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { fetchCoffeeBag } from '../services/coffeeBagsApi';

export const useCoffeeBag = (id: string | null): UseQueryResult<CoffeeBag> =>
  useQuery({
    queryKey: QUERY_KEYS.coffeeBag(id ?? ''),
    queryFn: async (): Promise<CoffeeBag> => fetchCoffeeBag(id ?? ''),
    enabled: id !== null,
  });
