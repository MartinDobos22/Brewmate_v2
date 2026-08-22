import type { UseMutationResult } from '@tanstack/react-query';
import type { DeletedResponse } from '@brewmate/shared';

import { QUERY_ROOTS } from '../../../constants/queryKeys';
import { useInvalidatingMutation } from '../../../hooks/useEntityMutation';
import { deleteBrewLog } from '../services/brewLogsApi';

export const useDeleteBrewLog = (): UseMutationResult<DeletedResponse, Error, string> =>
  useInvalidatingMutation({
    mutationFn: deleteBrewLog,
    invalidates: [QUERY_ROOTS.brewLogs],
  });
