import type { UseMutationResult } from '@tanstack/react-query';
import { ANALYTICS_EVENT_NAMES, type BrewLog, type CreateBrewLogRequest } from '@brewmate/shared';

import { QUERY_ROOTS } from '../../../constants/queryKeys';
import { useInvalidatingMutation } from '../../../hooks/useEntityMutation';
import { createBrewLog } from '../services/brewLogsApi';

/**
 * Records a brew.
 *
 * Emphatically not optimistic: the bag is taken from the recipe and the
 * learning weight is priced from the declared constraints, both on the server.
 * Drawing a guess at how much this cup teaches the profile would be inventing
 * the one number this whole feature exists to get right.
 */
export const useCreateBrewLog = (): UseMutationResult<BrewLog, Error, CreateBrewLogRequest> =>
  useInvalidatingMutation({
    mutationFn: createBrewLog,
    invalidates: [QUERY_ROOTS.brewLogs],
    tracks: ANALYTICS_EVENT_NAMES.brewCompleted,
  });
