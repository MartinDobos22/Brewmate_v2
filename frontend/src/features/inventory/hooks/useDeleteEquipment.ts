import type { UseMutationResult } from '@tanstack/react-query';
import type { DeletedResponse } from '@brewmate/shared';

import { QUERY_ROOTS } from '../../../constants/queryKeys';
import { useInvalidatingMutation } from '../../../hooks/useEntityMutation';
import { deleteEquipment } from '../services/equipmentApi';

/**
 * Removes a piece of gear.
 *
 * The sets are invalidated too, because the API prunes the deleted id out of
 * every set that named it - a cached "Chata" still listing a grinder that is
 * gone would be a lie the app told itself.
 */
export const useDeleteEquipment = (): UseMutationResult<DeletedResponse, Error, string> =>
  useInvalidatingMutation({
    mutationFn: deleteEquipment,
    invalidates: [QUERY_ROOTS.equipment, QUERY_ROOTS.equipmentSets],
  });
