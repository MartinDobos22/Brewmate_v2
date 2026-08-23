/** Physical table names. Referenced by migrations, queries and test cleanup. */
export const TABLE_NAMES = {
  users: 'users',
  tasteProfiles: 'taste_profiles',
  tasteProfileEvents: 'taste_profile_events',
  brewMethods: 'brew_methods',
  grindersCatalog: 'grinders_catalog',
  equipment: 'equipment',
  equipmentSets: 'equipment_sets',
  coffeeBags: 'coffee_bags',
  bagEvaluations: 'bag_evaluations',
  coffeeBagParses: 'coffee_bag_parses',
  recipes: 'recipes',
  brewLogs: 'brew_logs',
  recipeChatMessages: 'recipe_chat_messages',
  aiUsageLogs: 'ai_usage_logs',
} as const;

export type TableName = (typeof TABLE_NAMES)[keyof typeof TABLE_NAMES];

/**
 * Truncation order for the test database.
 *
 * `users` alone would be enough - everything a user owns cascades from it -
 * but the two catalogues and the label cache do not belong to anybody, so they
 * are listed too.
 */
export const TRUNCATABLE_TABLE_NAMES = [
  TABLE_NAMES.users,
  TABLE_NAMES.brewMethods,
  TABLE_NAMES.grindersCatalog,
  TABLE_NAMES.coffeeBagParses,
] as const;
