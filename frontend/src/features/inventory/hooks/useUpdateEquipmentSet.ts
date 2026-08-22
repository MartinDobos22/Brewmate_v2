import type { UseMutationResult } from '@tanstack/react-query';
import type { EquipmentSet, UpdateEquipmentSetRequest } from '@brewmate/shared';

import { QUERY_KEYS, QUERY_ROOTS } from '../../../constants/queryKeys';
import { useOptimisticEntityMutation } from '../../../hooks/useEntityMutation';
import { updateEquipmentSet } from '../services/equipmentSetsApi';

export interface UpdateEquipmentSetVariables {
  readonly id: string;
  readonly changes: UpdateEquipmentSetRequest;
}

/**
 * Edits a set optimistically.
 *
 * The patch shown is the caller's own change; when it makes this set the
 * default, the settling refetch is what brings back the fact that another set
 * has stopped being one - the app never guesses at the other row.
 */
export const useUpdateEquipmentSet = (): UseMutationResult<
  EquipmentSet,
  Error,
  UpdateEquipmentSetVariables
> =>
  useOptimisticEntityMutation<UpdateEquipmentSetVariables, EquipmentSet>({
    mutationFn: async ({ id, changes }: UpdateEquipmentSetVariables): Promise<EquipmentSet> =>
      updateEquipmentSet(id, changes),
    entityId: ({ id }: UpdateEquipmentSetVariables): string => id,
    detailKey: ({ id }: UpdateEquipmentSetVariables) => QUERY_KEYS.equipmentSet(id),
    listRoot: QUERY_ROOTS.equipmentSets,
    optimisticPatch: ({ changes }: UpdateEquipmentSetVariables): Partial<EquipmentSet> => changes,
  });
