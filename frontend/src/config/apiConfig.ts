import { API_ROUTES } from '@brewmate/shared';

import { ENVIRONMENT_KEYS } from './environmentKeys';
import { readEnvironmentVariable } from './readEnvironmentVariable';

const MISSING_BASE_URL_MESSAGE = `${ENVIRONMENT_KEYS.apiBaseUrl} is not set. Copy .env.example to .env.`;

export interface ApiConfig {
  readonly baseUrl: string;
  readonly routes: typeof API_ROUTES;
}

/** Route paths come from @brewmate/shared, so the app can never drift from the API. */
export const readApiConfig = (): ApiConfig => {
  const baseUrl = readEnvironmentVariable(ENVIRONMENT_KEYS.apiBaseUrl);

  if (baseUrl === undefined) {
    throw new Error(MISSING_BASE_URL_MESSAGE);
  }

  return { baseUrl, routes: API_ROUTES };
};
