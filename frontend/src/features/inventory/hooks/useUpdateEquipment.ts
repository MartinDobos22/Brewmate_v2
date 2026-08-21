import type { UseMutationResult } from '@tanstack/react-query';
import type { Equipment, UpdateEquipmentRequest } from '@brewmate/shared';

import { QUERY_KEYS, QUERY_ROOTS } from '../../../constants/queryKeys';
import { useOptimisticEntityMutation } from '../../../hooks/useEntityMutation';
import { updateEquipment } from '../services/equipmentApi';

export interface UpdateEquipmentVariables {
  readonly id: string;
  readonly changes: UpdateEquipmentRequest;
}

/**
 * Edits a piece of gear, optimistically - renaming it or putting it aside with
 * `isActive` is a switch, and a switch that waits for a round trip feels broken.
 */
export const useUpdateEquipment = (): UseMutationResult<
  Equipment,
  Error,
  UpdateEquipmentVariables
> =>
  useOptimisticEntityMutation<UpdateEquipmentVariables, Equipment>({
    mutationFn: async ({ id, changes }: UpdateEquipmentVariables): Promise<Equipment> =>
      updateEquipment(id, changes),
    entityId: ({ id }: UpdateEquipmentVariables): string => id,
    detailKey: ({ id }: UpdateEquipmentVariables) => QUERY_KEYS.equipmentItem(id),
    listRoot: QUERY_ROOTS.equipment,
    optimisticPatch: ({ changes }: UpdateEquipmentVariables): Partial<Equipment> => changes,
  });
