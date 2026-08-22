import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { Grinder } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { fetchGrinder } from '../services/grindersApi';

export const useGrinder = (id: string | null): UseQueryResult<Grinder> =>
  useQuery({
    queryKey: QUERY_KEYS.grinder(id ?? ''),
    queryFn: async (): Promise<Grinder> => fetchGrinder(id ?? ''),
    enabled: id !== null,
  });
