/**
 * Names of the EXPO_PUBLIC_* variables the app reads.
 * Anything not prefixed EXPO_PUBLIC_ is invisible to the bundle - which is
 * exactly where API keys and service credentials must stay.
 */
export const ENVIRONMENT_KEYS = {
  apiBaseUrl: 'EXPO_PUBLIC_API_BASE_URL',
} as const;
