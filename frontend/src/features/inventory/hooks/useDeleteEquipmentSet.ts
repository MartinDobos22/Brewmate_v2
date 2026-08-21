import type { UseMutationResult } from '@tanstack/react-query';
import type { DeletedResponse } from '@brewmate/shared';

import { QUERY_ROOTS } from '../../../constants/queryKeys';
import { useInvalidatingMutation } from '../../../hooks/useEntityMutation';
import { deleteEquipmentSet } from '../services/equipmentSetsApi';

/** Removes a saved combination. The gear it named stays in the inventory. */
export const useDeleteEquipmentSet = (): UseMutationResult<DeletedResponse, Error, string> =>
  useInvalidatingMutation({
    mutationFn: deleteEquipmentSet,
    invalidates: [QUERY_ROOTS.equipmentSets],
  });
