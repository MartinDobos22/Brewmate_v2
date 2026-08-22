import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { EquipmentSet } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { fetchEquipmentSet } from '../services/equipmentSetsApi';

export const useEquipmentSet = (id: string | null): UseQueryResult<EquipmentSet> =>
  useQuery({
    queryKey: QUERY_KEYS.equipmentSet(id ?? ''),
    queryFn: async (): Promise<EquipmentSet> => fetchEquipmentSet(id ?? ''),
    enabled: id !== null,
  });
