import type { UseMutationResult } from '@tanstack/react-query';
import type { CreateTasteProfileEventRequest, TasteProfileEvent } from '@brewmate/shared';

import { QUERY_ROOTS } from '../../../constants/queryKeys';
import { useInvalidatingMutation } from '../../../hooks/useEntityMutation';
import { addTasteProfileEvent } from '../services/tasteProfileApi';

/**
 * Adds an observation about someone's taste.
 *
 * Not optimistic, and it could not honestly be: one event re-folds the entire
 * trail, and how far it moves each axis depends on how much the source is
 * trusted and how much evidence came before. That is arithmetic the server
 * owns; the app asks and then reads the result.
 */
export const useAddTasteProfileEvent = (): UseMutationResult<
  TasteProfileEvent,
  Error,
  CreateTasteProfileEventRequest
> =>
  useInvalidatingMutation({
    mutationFn: addTasteProfileEvent,
    invalidates: [QUERY_ROOTS.tasteProfile, QUERY_ROOTS.tasteProfileEvents],
  });
