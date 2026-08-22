import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { BrewLog } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { fetchBrewLog } from '../services/brewLogsApi';

export const useBrewLog = (id: string | null): UseQueryResult<BrewLog> =>
  useQuery({
    queryKey: QUERY_KEYS.brewLog(id ?? ''),
    queryFn: async (): Promise<BrewLog> => fetchBrewLog(id ?? ''),
    enabled: id !== null,
  });
