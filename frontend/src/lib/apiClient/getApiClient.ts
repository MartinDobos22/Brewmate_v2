import { readApiConfig } from '../../config';
import { firebaseTokenProvider } from '../firebase/firebaseTokenProvider';

import { createApiClient, type ApiClient } from './createApiClient';

let client: ApiClient | null = null;

/**
 * The app's single API client, built on first use. Lazy on purpose: a missing
 * EXPO_PUBLIC_API_BASE_URL should fail the request that needs it, not the
 * import graph of the whole app.
 *
 * Every request carries the current Firebase ID token; when nobody is signed
 * in the provider returns null and the header is left out.
 */
export const getApiClient = (): ApiClient => {
  client ??= createApiClient({
    baseUrl: readApiConfig().baseUrl,
    getAuthToken: firebaseTokenProvider,
  });

  return client;
};
