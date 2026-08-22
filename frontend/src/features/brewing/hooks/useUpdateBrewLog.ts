import type { UseMutationResult } from '@tanstack/react-query';
import type { BrewLog, UpdateBrewLogRequest } from '@brewmate/shared';

import { QUERY_ROOTS } from '../../../constants/queryKeys';
import { useInvalidatingMutation } from '../../../hooks/useEntityMutation';
import { updateBrewLog } from '../services/brewLogsApi';

export interface UpdateBrewLogVariables {
  readonly id: string;
  readonly changes: UpdateBrewLogRequest;
}

/**
 * Corrects a recorded brew.
 *
 * Not optimistic for the same reason as recording one: correcting the
 * constraints re-prices the learning weight, and the app has no business
 * predicting that number.
 */
export const useUpdateBrewLog = (): UseMutationResult<BrewLog, Error, UpdateBrewLogVariables> =>
  useInvalidatingMutation({
    mutationFn: async ({ id, changes }: UpdateBrewLogVariables): Promise<BrewLog> =>
      updateBrewLog(id, changes),
    invalidates: [QUERY_ROOTS.brewLogs],
  });
