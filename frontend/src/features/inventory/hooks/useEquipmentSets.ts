import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { EquipmentSet, ListFilter, ListResponse } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { fetchEquipmentSets } from '../services/equipmentSetsApi';

/** The saved combinations - "Domov", "Chata" - not new gear. */
export const useEquipmentSets = (filter?: ListFilter): UseQueryResult<ListResponse<EquipmentSet>> =>
  useQuery({
    queryKey: QUERY_KEYS.equipmentSets(filter),
    queryFn: async (): Promise<ListResponse<EquipmentSet>> => fetchEquipmentSets(filter),
  });
