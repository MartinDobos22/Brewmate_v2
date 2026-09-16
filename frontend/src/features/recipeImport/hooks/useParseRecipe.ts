import type { UseMutationResult } from '@tanstack/react-query';
import type { ParseRecipeRequest, ParseRecipeResponse } from '@brewmate/shared';

import { QUERY_ROOTS } from '../../../constants/queryKeys';
import { useInvalidatingMutation } from '../../../hooks/useEntityMutation';
import { sendWithRetry } from '../../bagEvaluations/services';
import { parseRecipe } from '../services/recipeImportApi';

/**
 * Reads a pasted or photographed recipe into fields.
 *
 * Never optimistic: there is nothing to guess at. What comes back is the whole
 * question this screen exists to ask - "is this what the recipe said?" - and
 * drawing a placeholder version of it would be answering on the model's
 * behalf.
 *
 * It walks the same few steps a scan does before giving up, because this
 * request may now carry a photograph too and a request that never arrived was
 * never billed. Only a connection that gave out is repeated - a refusal by the
 * API is an answer, and asking it three times spends an allowance to hear it
 * three times.
 */
export const useParseRecipe = (): UseMutationResult<
  ParseRecipeResponse,
  Error,
  ParseRecipeRequest
> =>
  useInvalidatingMutation({
    mutationFn: async (input: ParseRecipeRequest): Promise<ParseRecipeResponse> =>
      sendWithRetry(async (): Promise<ParseRecipeResponse> => parseRecipe(input)),
    invalidates: [QUERY_ROOTS.aiUsage],
  });
