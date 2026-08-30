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
  brewMode: '/brew-mode',
  importRecipe: '/import-recipe',
  dialIn: '/dial-in',
  quickBrew: '/quick-brew',
  scan: '/scan',
  coffeeBags: '/coffee-bags',
  profile: '/profile',
  onboarding: '/onboarding',
  chat: '/chat',
  insights: '/insights',
  timeline: '/timeline',
  aiCosts: '/ai-costs',
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

const RECIPE_PARAM = '?recipeId=';
const BREW_LOG_PARAM = '&brewLogId=';
const EQUIPMENT_SET_PARAM = '&equipmentSetId=';

/**
 * A recipe's own brew mode, and the conversation about it afterwards.
 *
 * Built here for the same reason every other path is: a screen is reached
 * through one definition, so renaming a route is one edit rather than a search
 * for string concatenation.
 */
export const buildBrewModeRoute = (recipeId: string, equipmentSetId?: string | null): string =>
  [
    ROUTES.brewMode,
    RECIPE_PARAM,
    encodeURIComponent(recipeId),
    ...(equipmentSetId === undefined || equipmentSetId === null
      ? []
      : [EQUIPMENT_SET_PARAM, encodeURIComponent(equipmentSetId)]),
  ].join('');

/**
 * The chat about one recipe, and optionally about one cup of it.
 *
 * The brew log travels in the path because it is what makes the answer about a
 * cup rather than about a recipe: it carries the constraints that brew was
 * made under, which decide both what may be suggested and how much what gets
 * said afterwards is allowed to teach the profile.
 */
export const buildRecipeChatRoute = (recipeId: string, brewLogId?: string): string =>
  [
    ROUTES.chat,
    RECIPE_PARAM,
    encodeURIComponent(recipeId),
    ...(brewLogId === undefined ? [] : [BREW_LOG_PARAM, encodeURIComponent(brewLogId)]),
  ].join('');

/**
 * One coffee's dial-in, addressed by the recipe it started from.
 *
 * The recipe travels in the path rather than being remembered, because a
 * dial-in happens over minutes with the phone in a pocket between shots: a
 * screen that lost its place when the app was backgrounded would lose the run
 * the whole mode is built on.
 */
export const buildDialInRoute = (recipeId: string): string =>
  [ROUTES.dialIn, RECIPE_PARAM, encodeURIComponent(recipeId)].join('');

const METHOD_PARAM = '?methodId=';
const BAG_PARAM = '&bagId=';

/**
 * One recipe line's own screen, addressed by the pair it belongs to.
 *
 * The bag is optional in the path for the same reason it is optional in the
 * query: a recipe written for beans nobody wrote down still has a history, and
 * leaving the parameter off is what asks for it.
 */
export const buildTimelineRoute = (methodId: string, bagId?: string | null): string =>
  [
    ROUTES.timeline,
    METHOD_PARAM,
    encodeURIComponent(methodId),
    ...(bagId === undefined || bagId === null ? [] : [BAG_PARAM, encodeURIComponent(bagId)]),
  ].join('');

const BREW_BAG_PARAM = '?bagId=';

/**
 * The brewing screen, opened for one coffee.
 *
 * The bag travels in the path rather than being remembered, for the same
 * reason every other screen's subject does: the tab can be reached from the
 * bar at any moment, and a preselection held in memory would reappear days
 * later on a screen nobody opened from a bag.
 */
export const buildBrewRoute = (bagId: string): string =>
  `${ROUTES.brew}${BREW_BAG_PARAM}${encodeURIComponent(bagId)}`;

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
