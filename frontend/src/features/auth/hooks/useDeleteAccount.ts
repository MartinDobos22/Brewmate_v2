import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { TRANSLATION_KEYS } from '../../../i18n';
import { deleteAccount } from '../services/sessionActions';

import { useAuthAction, type AuthAction } from './useAuthAction';

/**
 * Deletes the account, then leaves the app in the state a first-time visitor
 * sees: signed out, with nothing cached.
 */
export const useDeleteAccount = (): AuthAction => {
  const queryClient = useQueryClient();

  return useAuthAction(
    useCallback(async (): Promise<void> => {
      await deleteAccount();
      queryClient.clear();
    }, [queryClient]),
    TRANSLATION_KEYS.authErrorDeleteFailed,
  );
};
