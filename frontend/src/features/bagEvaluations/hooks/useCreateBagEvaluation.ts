import type { UseMutationResult } from '@tanstack/react-query';
import type { BagEvaluation, CreateBagEvaluationRequest } from '@brewmate/shared';

import { QUERY_ROOTS } from '../../../constants/queryKeys';
import { useInvalidatingMutation } from '../../../hooks/useEntityMutation';
import { createBagEvaluation } from '../services/bagEvaluationsApi';

/**
 * Records a verdict on a bag.
 *
 * Not optimistic: how confident the profile was at that moment is read off the
 * profile by the API, and it is the number that says how much the advice was
 * worth.
 */
export const useCreateBagEvaluation = (): UseMutationResult<
  BagEvaluation,
  Error,
  CreateBagEvaluationRequest
> =>
  useInvalidatingMutation({
    mutationFn: createBagEvaluation,
    invalidates: [QUERY_ROOTS.bagEvaluations],
  });
