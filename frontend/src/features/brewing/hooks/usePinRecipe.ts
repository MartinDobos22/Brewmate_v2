import { useCallback } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';
import type { Recipe, UpdateRecipeRequest } from '@brewmate/shared';

import { useUpdateRecipe, type UpdateRecipeVariables } from './useUpdateRecipe';

export interface RecipePinner {
  readonly pin: (id: string) => void;
  readonly unpin: (id: string) => void;
  readonly isPending: boolean;
}

const PINNED: UpdateRecipeRequest = { isPinned: true };
const UNPINNED: UpdateRecipeRequest = { isPinned: false };

/**
 * Marks a recipe as the one to use for its bag and method.
 *
 * The star fills in immediately; the API is what enforces that only one recipe
 * per (bag, method) pair holds it, and the refetch that follows is what shows
 * the previous favourite letting go.
 */
export const usePinRecipe = (): RecipePinner => {
  const mutation: UseMutationResult<Recipe, Error, UpdateRecipeVariables> = useUpdateRecipe();
  const { mutate } = mutation;

  return {
    pin: useCallback(
      (id: string): void => {
        mutate({ id, changes: PINNED });
      },
      [mutate],
    ),
    unpin: useCallback(
      (id: string): void => {
        mutate({ id, changes: UNPINNED });
      },
      [mutate],
    ),
    isPending: mutation.isPending,
  };
};
