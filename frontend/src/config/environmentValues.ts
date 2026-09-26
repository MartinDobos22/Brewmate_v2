import type { EnvironmentKey } from './environmentKeys';

/**
 * Expo inlines EXPO_PUBLIC_* variables at build time. Typed locally because the
 * app bundle has no Node type definitions.
 */
declare const process: { readonly env: Readonly<Record<string, string | undefined>> };

/**
 * Every EXPO_PUBLIC_* value the app reads, each written out as a static
 * `process.env.EXPO_PUBLIC_...` member access.
 *
 * That spelling is the whole point of this file. Expo's Babel preset replaces
 * exactly this expression with the value at build time and nothing else: a
 * computed `process.env[key]` is left alone. Under `expo start` the dev server
 * also fills a real `process.env` object, so the computed form works there and
 * only breaks in a release build - where `process.env` is empty and the app
 * crashed at launch with "EXPO_PUBLIC_FIREBASE_API_KEY is not set" although
 * EAS had loaded the variable.
 *
 * `satisfies` keeps the map total over ENVIRONMENT_KEYS, so a new key without a
 * line here is a type error rather than a variable that is silently never read.
 */
export const ENVIRONMENT_VALUES = {
  EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
  EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  EXPO_PUBLIC_FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  EXPO_PUBLIC_SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
  EXPO_PUBLIC_RELEASE: process.env.EXPO_PUBLIC_RELEASE,
} satisfies Record<EnvironmentKey, string | undefined>;
