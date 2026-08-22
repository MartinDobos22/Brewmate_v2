import type { UseMutationResult } from '@tanstack/react-query';
import type { DeletedResponse } from '@brewmate/shared';

import { QUERY_ROOTS } from '../../../constants/queryKeys';
import { useInvalidatingMutation } from '../../../hooks/useEntityMutation';
import { deleteRecipe } from '../services/recipesApi';

/**
 * Removes a recipe.
 *
 * Not optimistic, and deliberately so: a recipe that has already been brewed
 * cannot be deleted at all, and taking it off the screen before the API says
 * whether that applies would mean putting it back a moment later.
 */
export const useDeleteRecipe = (): UseMutationResult<DeletedResponse, Error, string> =>
  useInvalidatingMutation({
    mutationFn: deleteRecipe,
    invalidates: [QUERY_ROOTS.recipes],
  });
