import {
  API_ROUTES,
  deleteAccountResponseSchema,
  userSchema,
  type DeleteAccountResponse,
  type User,
} from '@brewmate/shared';

import { HTTP_METHODS } from '../../../constants/http';
import { getApiClient } from '../../../lib/apiClient';

/**
 * Reads the Brewmate user behind the Firebase identity. The API creates the
 * row on the first authenticated call, so this is also what provisions a
 * brand new account.
 */
export const fetchCurrentUser = async (): Promise<User> =>
  getApiClient().request({ path: API_ROUTES.me, schema: userSchema });

/** Erases the account: the data on the server first, then the Firebase identity. */
export const requestAccountDeletion = async (): Promise<DeleteAccountResponse> =>
  getApiClient().request({
    path: API_ROUTES.me,
    method: HTTP_METHODS.delete,
    schema: deleteAccountResponseSchema,
  });
