/** Firebase provider identifiers for the three ways into the app. */
export const AUTH_PROVIDER_IDS = {
  password: 'password',
  google: 'google.com',
  apple: 'apple.com',
} as const;

export type AuthProviderId = (typeof AUTH_PROVIDER_IDS)[keyof typeof AUTH_PROVIDER_IDS];
