import type { EvaluateCoffeeRequest, EvaluateCoffeeResponse } from '@brewmate/shared';
import type { UseMutationResult } from '@tanstack/react-query';

import { QUERY_ROOTS } from '../../../constants/queryKeys';
import { useInvalidatingMutation } from '../../../hooks/useEntityMutation';
import { evaluateCoffee } from '../services/coffeeBagAiApi';

/**
 * Asks whether this coffee is worth buying.
 *
 * Never optimistic: every word of the answer is the server's, and so is the
 * decision to hand back an earlier verdict rather than write a new one. There
 * is nothing here the app could honestly draw before the reply arrives.
 */
export const useEvaluateCoffee = (): UseMutationResult<
  EvaluateCoffeeResponse,
  Error,
  EvaluateCoffeeRequest
> =>
  useInvalidatingMutation({
    mutationFn: evaluateCoffee,
    invalidates: [QUERY_ROOTS.bagEvaluations, QUERY_ROOTS.aiUsage],
  });
