import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { Equipment, EquipmentFilter, ListResponse } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { fetchEquipmentList } from '../services/equipmentApi';

/** Everything the user owns, optionally narrowed to one kind of gear. */
export const useEquipmentList = (
  filter?: EquipmentFilter,
): UseQueryResult<ListResponse<Equipment>> =>
  useQuery({
    queryKey: QUERY_KEYS.equipmentList(filter),
    queryFn: async (): Promise<ListResponse<Equipment>> => fetchEquipmentList(filter),
  });
