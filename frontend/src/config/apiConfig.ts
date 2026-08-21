import { API_ROUTES } from '@brewmate/shared';

import { ENVIRONMENT_KEYS } from './environmentKeys';
import { requireEnvironmentVariable } from './requireEnvironmentVariable';

export interface ApiConfig {
  readonly baseUrl: string;
  readonly routes: typeof API_ROUTES;
}

/** Route paths come from @brewmate/shared, so the app can never drift from the API. */
export const readApiConfig = (): ApiConfig => ({
  baseUrl: requireEnvironmentVariable(ENVIRONMENT_KEYS.apiBaseUrl),
  routes: API_ROUTES,
});
