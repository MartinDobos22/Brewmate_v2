import type { AuthTokenProvider } from '../apiClient/authTokenProvider';

import { getFirebaseAuth } from './getFirebaseAuth';

/**
 * Supplies the Firebase ID token for the Authorization header.
 *
 * `getIdToken` hands back the cached token and refreshes it on its own once it
 * is close to expiring, so every request carries a valid token without the app
 * tracking any expiry itself. `forceRefresh` is used after the API answers 401,
 * to rule out a token that was revoked rather than merely stale.
 */
export const firebaseTokenProvider: AuthTokenProvider = async (
  forceRefresh: boolean,
): Promise<string | null> => {
  const { currentUser } = getFirebaseAuth();

  if (currentUser === null) {
    return null;
  }

  return currentUser.getIdToken(forceRefresh);
};
