/**
 * Names of the EXPO_PUBLIC_* variables the app reads.
 * Anything not prefixed EXPO_PUBLIC_ is invisible to the bundle - which is
 * exactly where API keys and service credentials must stay.
 *
 * The Firebase *client* configuration below is public by design: it identifies
 * the project, it does not authorise anything. The Admin credentials live in
 * server/.env and never reach the app.
 */
export const ENVIRONMENT_KEYS = {
  apiBaseUrl: 'EXPO_PUBLIC_API_BASE_URL',
  firebaseApiKey: 'EXPO_PUBLIC_FIREBASE_API_KEY',
  firebaseAuthDomain: 'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  firebaseProjectId: 'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  firebaseAppId: 'EXPO_PUBLIC_FIREBASE_APP_ID',
  googleWebClientId: 'EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID',
  googleIosClientId: 'EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID',
  googleAndroidClientId: 'EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID',
} as const;

export type EnvironmentKey = (typeof ENVIRONMENT_KEYS)[keyof typeof ENVIRONMENT_KEYS];
