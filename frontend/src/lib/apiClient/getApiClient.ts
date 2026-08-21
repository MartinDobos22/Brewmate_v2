import { readApiConfig } from '../../config';

import { createApiClient, type ApiClient } from './createApiClient';

let client: ApiClient | null = null;

/**
 * The app's single API client, built on first use. Lazy on purpose: a missing
 * EXPO_PUBLIC_API_BASE_URL should fail the request that needs it, not the
 * import graph of the whole app.
 */
export const getApiClient = (): ApiClient => {
  client ??= createApiClient({ baseUrl: readApiConfig().baseUrl });

  return client;
};
