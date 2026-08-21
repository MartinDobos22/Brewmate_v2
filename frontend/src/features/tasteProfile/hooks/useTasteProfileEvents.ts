import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { ListFilter, ListResponse, TasteProfileEvent } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { fetchTasteProfileEvents } from '../services/tasteProfileApi';

/** The evidence behind the profile, so it can be shown rather than asserted. */
export const useTasteProfileEvents = (
  filter?: ListFilter,
): UseQueryResult<ListResponse<TasteProfileEvent>> =>
  useQuery({
    queryKey: QUERY_KEYS.tasteProfileEvents(filter),
    queryFn: async (): Promise<ListResponse<TasteProfileEvent>> => fetchTasteProfileEvents(filter),
  });
