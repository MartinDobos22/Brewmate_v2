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
  grinders: '/grinders',
  brew: '/brew',
  quickBrew: '/quick-brew',
  scan: '/scan',
  coffeeBags: '/coffee-bags',
  profile: '/profile',
  onboarding: '/onboarding',
  chat: '/chat',
  designSystem: '/design-system',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

const ROUTE_SEPARATOR = '/';

/**
 * One coffee's own screen.
 *
 * Built here rather than at the call site for the same reason every other path
 * is a constant: a screen is reached through one definition, so renaming the
 * route is one edit rather than a search for string concatenation.
 */
export const buildBagRoute = (bagId: string): string =>
  [ROUTES.coffeeBags, encodeURIComponent(bagId)].join(ROUTE_SEPARATOR);

const MODE_PARAM = '?mode=';

/**
 * The scanner, opened straight into one of its two modes.
 *
 * The cupboard already knows somebody came to add a bag rather than to ask
 * about one, so it says so instead of making them answer that question again.
 */
export const buildScanRoute = (mode: string): string =>
  `${ROUTES.scan}${MODE_PARAM}${encodeURIComponent(mode)}`;

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
