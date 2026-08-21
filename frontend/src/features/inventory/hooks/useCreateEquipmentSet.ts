import type { UseMutationResult } from '@tanstack/react-query';
import type { CreateEquipmentSetRequest, EquipmentSet } from '@brewmate/shared';

import { QUERY_ROOTS } from '../../../constants/queryKeys';
import { useInvalidatingMutation } from '../../../hooks/useEntityMutation';
import { createEquipmentSet } from '../services/equipmentSetsApi';

/**
 * Saves a combination of gear.
 *
 * Not optimistic: the API checks that every piece named really belongs to this
 * account, and marking one set as the default releases whichever was default
 * before - two outcomes the app should not paint before they happen.
 */
export const useCreateEquipmentSet = (): UseMutationResult<
  EquipmentSet,
  Error,
  CreateEquipmentSetRequest
> =>
  useInvalidatingMutation({
    mutationFn: createEquipmentSet,
    invalidates: [QUERY_ROOTS.equipmentSets],
  });
