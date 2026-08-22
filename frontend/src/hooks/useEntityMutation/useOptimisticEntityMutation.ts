import {
  useMutation,
  useQueryClient,
  type QueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';
import type { ListResponse } from '@brewmate/shared';

import type { AppQueryKey } from '../../constants/queryKeys';
import { patchEntity } from '../../lib/queryCache/patchEntity';
import { patchListResponse, type Identified } from '../../lib/queryCache/patchListResponse';

/** What was in the cache before the guess, so a failure can put it back. */
type CacheSnapshot = readonly (readonly [AppQueryKey, unknown])[];

export interface OptimisticEntityMutationOptions<TVariables, TEntity extends Identified> {
  readonly mutationFn: (variables: TVariables) => Promise<TEntity>;
  /** The entity being changed. */
  readonly entityId: (variables: TVariables) => string;
  readonly detailKey: (variables: TVariables) => AppQueryKey;
  /** The domain root, so every cached page of it is patched and refetched. */
  readonly listRoot: AppQueryKey;
  /** The change to show before the server has answered. */
  readonly optimisticPatch: (variables: TVariables) => Partial<TEntity>;
}

const patchCachedLists = <TEntity extends Identified>(
  queryClient: QueryClient,
  listRoot: AppQueryKey,
  id: string,
  patch: Partial<TEntity>,
): void => {
  queryClient.setQueriesData<ListResponse<TEntity>>(
    { queryKey: listRoot },
    (data: ListResponse<TEntity> | undefined): ListResponse<TEntity> | undefined =>
      patchListResponse(data, id, patch),
  );
};

/**
 * A write the app can show before the server confirms it.
 *
 * Only for changes whose outcome is not in doubt: pinning a recipe, archiving
 * a bag, renaming a set, marking a bag as bought. The patch goes into every
 * cached page and into the detail entry, the previous contents are kept, and a
 * failure puts them straight back. Either way the domain is refetched
 * afterwards, so the guess never outlives the answer.
 *
 * Writes whose result the server decides use `useInvalidatingMutation`
 * instead - guessing at a value the API is about to compute would mean showing
 * the user a number that is about to change under them.
 */
export const useOptimisticEntityMutation = <TVariables, TEntity extends Identified>({
  mutationFn,
  entityId,
  detailKey,
  listRoot,
  optimisticPatch,
}: OptimisticEntityMutationOptions<TVariables, TEntity>): UseMutationResult<
  TEntity,
  Error,
  TVariables,
  CacheSnapshot
> => {
  const queryClient = useQueryClient();

  return useMutation<TEntity, Error, TVariables, CacheSnapshot>({
    mutationFn,

    onMutate: async (variables: TVariables): Promise<CacheSnapshot> => {
      const detail = detailKey(variables);

      await queryClient.cancelQueries({ queryKey: listRoot });
      await queryClient.cancelQueries({ queryKey: detail });

      const snapshot: CacheSnapshot = [
        ...queryClient.getQueriesData({ queryKey: listRoot }),
        ...queryClient.getQueriesData({ queryKey: detail }),
      ];
      const patch = optimisticPatch(variables);

      patchCachedLists<TEntity>(queryClient, listRoot, entityId(variables), patch);
      queryClient.setQueryData<TEntity>(detail, (data: TEntity | undefined): TEntity | undefined =>
        patchEntity(data, patch),
      );

      return snapshot;
    },

    onError: (_error: Error, _variables: TVariables, snapshot?: CacheSnapshot): void => {
      for (const [queryKey, data] of snapshot ?? []) {
        queryClient.setQueryData(queryKey, data);
      }
    },

    onSettled: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: listRoot });
    },
  });
};
