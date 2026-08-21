/**
 * Every expo-router path the app navigates to. A screen is reached through a
 * constant, never through a string written at the call site.
 */
export const ROUTES = {
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  forgotPassword: '/forgot-password',
  verifyEmail: '/verify-email',
  inventory: '/inventory',
  brew: '/brew',
  profile: '/profile',
  onboarding: '/onboarding',
  chat: '/chat',
  designSystem: '/design-system',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

/** Route segment names, as expo-router addresses the files inside `(tabs)`. */
export const TAB_SEGMENTS = {
  home: 'index',
  inventory: 'inventory',
  brew: 'brew',
  profile: 'profile',
} as const;

export type TabSegment = (typeof TAB_SEGMENTS)[keyof typeof TAB_SEGMENTS];

/** Left-to-right order of the bottom tabs. */
export const TAB_ORDER = [
  TAB_SEGMENTS.home,
  TAB_SEGMENTS.inventory,
  TAB_SEGMENTS.brew,
  TAB_SEGMENTS.profile,
] as const;

/**
 * The expo-router group holding the screens a signed-out visitor may see.
 * `useProtectedRoute` compares the first segment against it.
 */
export const AUTH_GROUP_SEGMENT = '(auth)';
