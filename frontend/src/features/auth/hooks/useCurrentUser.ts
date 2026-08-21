import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { User } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { AUTH_STATUS } from '../constants/authStatus';
import { useAuthSession } from '../context/useAuthSession';
import { fetchCurrentUser } from '../services/accountApi';

/**
 * The Brewmate user behind the Firebase session.
 *
 * Mounted by the auth gate, so the first authenticated request happens as soon
 * as someone signs in - which is exactly when the API creates the row for a
 * brand new account.
 */
export const useCurrentUser = (): UseQueryResult<User> => {
  const { status } = useAuthSession();

  return useQuery({
    queryKey: QUERY_KEYS.currentUser(),
    queryFn: fetchCurrentUser,
    enabled: status === AUTH_STATUS.authenticated,
  });
};
