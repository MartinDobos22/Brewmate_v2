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
  /** Everything this account has stored, in one document. */
  meExport: '/me/export',

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
  aiUsageSummary: '/ai-usage/summary',

  historyTimeline: '/history/timeline',

  insights: '/insights',
  insightSuggestionAccept: '/insights/suggestion/accept',
  insightSuggestionDismiss: '/insights/suggestion/dismiss',

  analyticsEvents: '/analytics/events',

  aiParseCoffeeBag: '/ai/parse-coffee-bag',
  aiEvaluateCoffee: '/ai/evaluate-coffee',
  aiGenerateRecipe: '/ai/generate-recipe',
  aiRecipeChat: '/ai/recipe-chat',
  aiParseRecipe: '/ai/parse-recipe',
  aiConvertRecipe: '/ai/convert-recipe',
  aiEspressoDialIn: '/ai/espresso-dial-in',
} as const;

export type ApiRoute = (typeof API_ROUTES)[keyof typeof API_ROUTES];
