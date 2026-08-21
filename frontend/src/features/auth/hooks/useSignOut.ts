import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { signOutFromFirebase } from '../services/sessionActions';

import { useAuthAction, type AuthAction } from './useAuthAction';

/**
 * Signs out and empties the query cache, so the next account never sees the
 * previous one's data - not even for the moment before a refetch lands.
 */
export const useSignOut = (): AuthAction => {
  const queryClient = useQueryClient();

  return useAuthAction(
    useCallback(async (): Promise<void> => {
      await signOutFromFirebase();
      queryClient.clear();
    }, [queryClient]),
  );
};
