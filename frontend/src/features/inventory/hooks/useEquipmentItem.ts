import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { Equipment } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { fetchEquipmentItem } from '../services/equipmentApi';

export const useEquipmentItem = (id: string | null): UseQueryResult<Equipment> =>
  useQuery({
    queryKey: QUERY_KEYS.equipmentItem(id ?? ''),
    queryFn: async (): Promise<Equipment> => fetchEquipmentItem(id ?? ''),
    enabled: id !== null,
  });
