import type { UseMutationResult } from '@tanstack/react-query';
import type { CreateEquipmentRequest, Equipment } from '@brewmate/shared';

import { QUERY_ROOTS } from '../../../constants/queryKeys';
import { useInvalidatingMutation } from '../../../hooks/useEntityMutation';
import { createEquipment } from '../services/equipmentApi';

export const useCreateEquipment = (): UseMutationResult<Equipment, Error, CreateEquipmentRequest> =>
  useInvalidatingMutation({
    mutationFn: createEquipment,
    invalidates: [QUERY_ROOTS.equipment],
  });
