import type { UseMutationResult } from '@tanstack/react-query';
import type { ParseRecipeRequest, ParseRecipeResponse } from '@brewmate/shared';

import { QUERY_ROOTS } from '../../../constants/queryKeys';
import { useInvalidatingMutation } from '../../../hooks/useEntityMutation';
import { parseRecipe } from '../services/recipeImportApi';

/**
 * Reads a pasted or photographed recipe into fields.
 *
 * Never optimistic: there is nothing to guess at. What comes back is the whole
 * question this screen exists to ask - "is this what the recipe said?" - and
 * drawing a placeholder version of it would be answering on the model's
 * behalf.
 */
export const useParseRecipe = (): UseMutationResult<
  ParseRecipeResponse,
  Error,
  ParseRecipeRequest
> => useInvalidatingMutation({ mutationFn: parseRecipe, invalidates: [QUERY_ROOTS.aiUsage] });
