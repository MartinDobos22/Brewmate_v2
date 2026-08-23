/**
 * Single source of truth for API paths.
 * Never write a route path as a literal in client or server code.
 *
 * A path containing `:name` is a Fastify pattern; the app turns it into a
 * concrete URL with `buildApiPath`.
 */
export const API_ROUTES = {
  health: '/health',
  me: '/me',

  brewMethods: '/brew-methods',

  grinders: '/grinders',
  grinderById: '/grinders/:id',

  equipment: '/equipment',
  equipmentById: '/equipment/:id',

  equipmentSets: '/equipment-sets',
  equipmentSetById: '/equipment-sets/:id',

  coffeeBags: '/coffee-bags',
  coffeeBagById: '/coffee-bags/:id',

  bagEvaluations: '/bag-evaluations',
  bagEvaluationById: '/bag-evaluations/:id',

  recipes: '/recipes',
  recipeById: '/recipes/:id',
  recipeMessages: '/recipes/:id/messages',

  brewLogs: '/brew-logs',
  brewLogById: '/brew-logs/:id',

  tasteProfile: '/taste-profile',
  tasteProfileEvents: '/taste-profile/events',
  tasteProfileRecompute: '/taste-profile/recompute',

  aiUsage: '/ai-usage',

  aiParseCoffeeBag: '/ai/parse-coffee-bag',
  aiEvaluateCoffee: '/ai/evaluate-coffee',
} as const;

export type ApiRoute = (typeof API_ROUTES)[keyof typeof API_ROUTES];
