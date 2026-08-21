import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import type { UpdateUserRequest, User } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { patchEntity } from '../../../lib/queryCache/patchEntity';
import { updateCurrentUser } from '../../auth/services/accountApi';

/**
 * Edits the signed-in user, optimistically.
 *
 * A display name and a default water type are the user's own settings: there
 * is nothing for the server to decide, so the switch moves at once and only
 * goes back if the request fails.
 *
 * The account is a single entity with no list behind it, so this does its own
 * small version of the optimistic dance rather than borrowing the entity one.
 */
export const useUpdateCurrentUser = (): UseMutationResult<
  User,
  Error,
  UpdateUserRequest,
  User | undefined
> => {
  const queryClient = useQueryClient();
  const queryKey = QUERY_KEYS.currentUser();

  return useMutation<User, Error, UpdateUserRequest, User | undefined>({
    mutationFn: updateCurrentUser,

    onMutate: async (changes: UpdateUserRequest): Promise<User | undefined> => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<User>(queryKey);

      queryClient.setQueryData<User>(queryKey, (data: User | undefined): User | undefined =>
        patchEntity(data, changes),
      );

      return previous;
    },

    onError: (_error: Error, _changes: UpdateUserRequest, previous?: User): void => {
      queryClient.setQueryData(queryKey, previous);
    },

    onSettled: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });
};
