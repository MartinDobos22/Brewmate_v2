import type { UseMutationResult } from '@tanstack/react-query';
import type { BagEvaluation, UpdateBagEvaluationRequest } from '@brewmate/shared';

import { QUERY_KEYS, QUERY_ROOTS } from '../../../constants/queryKeys';
import { useOptimisticEntityMutation } from '../../../hooks/useEntityMutation';
import { updateBagEvaluation } from '../services/bagEvaluationsApi';

export interface UpdateBagEvaluationVariables {
  readonly id: string;
  readonly changes: UpdateBagEvaluationRequest;
}

/**
 * Closes the loop on a verdict, optimistically.
 *
 * "I bought it" is a tap in a shop, on whatever signal a shop has. It shows
 * immediately and, if the request never lands, quietly goes back.
 */
export const useUpdateBagEvaluation = (): UseMutationResult<
  BagEvaluation,
  Error,
  UpdateBagEvaluationVariables
> =>
  useOptimisticEntityMutation<UpdateBagEvaluationVariables, BagEvaluation>({
    mutationFn: async ({ id, changes }: UpdateBagEvaluationVariables): Promise<BagEvaluation> =>
      updateBagEvaluation(id, changes),
    entityId: ({ id }: UpdateBagEvaluationVariables): string => id,
    detailKey: ({ id }: UpdateBagEvaluationVariables) => QUERY_KEYS.bagEvaluation(id),
    listRoot: QUERY_ROOTS.bagEvaluations,
    optimisticPatch: ({ changes }: UpdateBagEvaluationVariables): Partial<BagEvaluation> => changes,
  });
