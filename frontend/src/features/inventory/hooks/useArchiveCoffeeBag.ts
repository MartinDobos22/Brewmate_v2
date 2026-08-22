import type { UseMutationResult } from '@tanstack/react-query';
import type { CoffeeBag } from '@brewmate/shared';

import { QUERY_KEYS, QUERY_ROOTS } from '../../../constants/queryKeys';
import { useOptimisticEntityMutation } from '../../../hooks/useEntityMutation';
import { archiveCoffeeBag } from '../services/coffeeBagsApi';

const ARCHIVED = true;

/**
 * Archives a finished bag, optimistically: it leaves the list at once, and the
 * brew logs that point at it are untouched.
 */
export const useArchiveCoffeeBag = (): UseMutationResult<CoffeeBag, Error, string> =>
  useOptimisticEntityMutation<string, CoffeeBag>({
    mutationFn: archiveCoffeeBag,
    entityId: (id: string): string => id,
    detailKey: (id: string) => QUERY_KEYS.coffeeBag(id),
    listRoot: QUERY_ROOTS.coffeeBags,
    optimisticPatch: (): Partial<CoffeeBag> => ({ isArchived: ARCHIVED }),
  });
