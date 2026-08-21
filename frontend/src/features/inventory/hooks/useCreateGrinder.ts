import type { UseMutationResult } from '@tanstack/react-query';
import type { CreateGrinderRequest, Grinder } from '@brewmate/shared';

import { QUERY_ROOTS } from '../../../constants/queryKeys';
import { useInvalidatingMutation } from '../../../hooks/useEntityMutation';
import { createGrinder } from '../services/grindersApi';

/**
 * Contributes a grinder to the catalogue.
 *
 * Not optimistic: whether it is verified, and whether an equivalent entry
 * already exists, are both the server's answer to give.
 */
export const useCreateGrinder = (): UseMutationResult<Grinder, Error, CreateGrinderRequest> =>
  useInvalidatingMutation({
    mutationFn: createGrinder,
    invalidates: [QUERY_ROOTS.grinders],
  });
