import type { UseMutationResult } from '@tanstack/react-query';
import type { CoffeeBag, UpdateCoffeeBagRequest } from '@brewmate/shared';

import { QUERY_KEYS, QUERY_ROOTS } from '../../../constants/queryKeys';
import { useOptimisticEntityMutation } from '../../../hooks/useEntityMutation';
import { updateCoffeeBag } from '../services/coffeeBagsApi';

export interface UpdateCoffeeBagVariables {
  readonly id: string;
  readonly changes: UpdateCoffeeBagRequest;
}

/**
 * Edits a bag, optimistically.
 *
 * Weighing out a dose is the commonest thing anyone does to a bag, and it has
 * to feel instant. The API only refuses if the amount left would exceed what
 * the bag holds, in which case the previous value comes straight back.
 */
export const useUpdateCoffeeBag = (): UseMutationResult<
  CoffeeBag,
  Error,
  UpdateCoffeeBagVariables
> =>
  useOptimisticEntityMutation<UpdateCoffeeBagVariables, CoffeeBag>({
    mutationFn: async ({ id, changes }: UpdateCoffeeBagVariables): Promise<CoffeeBag> =>
      updateCoffeeBag(id, changes),
    entityId: ({ id }: UpdateCoffeeBagVariables): string => id,
    detailKey: ({ id }: UpdateCoffeeBagVariables) => QUERY_KEYS.coffeeBag(id),
    listRoot: QUERY_ROOTS.coffeeBags,
    optimisticPatch: ({ changes }: UpdateCoffeeBagVariables): Partial<CoffeeBag> => changes,
  });
