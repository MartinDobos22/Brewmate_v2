/**
 * TanStack Query cache keys. Every key is built here so an invalidation can
 * never miss a query because two call sites spelled the key differently.
 *
 * A list key carries its filter, so two filters cache separately; invalidating
 * the root of a domain still matches every one of them, because TanStack
 * matches keys by prefix.
 */
const ROOT = {
  health: 'health',
  currentUser: 'currentUser',
  tasteProfile: 'tasteProfile',
  tasteProfileEvents: 'tasteProfileEvents',
  brewMethods: 'brewMethods',
  grinders: 'grinders',
  equipment: 'equipment',
  equipmentSets: 'equipmentSets',
  coffeeBags: 'coffeeBags',
  bagEvaluations: 'bagEvaluations',
  recipes: 'recipes',
  recipeMessages: 'recipeMessages',
  brewLogs: 'brewLogs',
  aiUsage: 'aiUsage',
} as const;

export type AppQueryKey = readonly unknown[];

/** The filter part of a list key; `undefined` means "the default list". */
export type QueryFilter = Readonly<Record<string, unknown>> | undefined;

export const QUERY_KEYS = {
  health: (): AppQueryKey => [ROOT.health],
  currentUser: (): AppQueryKey => [ROOT.currentUser],

  tasteProfile: (): AppQueryKey => [ROOT.tasteProfile],
  tasteProfileEvents: (filter?: QueryFilter): AppQueryKey => [ROOT.tasteProfileEvents, filter],

  brewMethods: (filter?: QueryFilter): AppQueryKey => [ROOT.brewMethods, filter],

  grinders: (filter?: QueryFilter): AppQueryKey => [ROOT.grinders, filter],
  grinder: (id: string): AppQueryKey => [ROOT.grinders, id],

  equipmentList: (filter?: QueryFilter): AppQueryKey => [ROOT.equipment, filter],
  equipmentItem: (id: string): AppQueryKey => [ROOT.equipment, id],

  equipmentSets: (filter?: QueryFilter): AppQueryKey => [ROOT.equipmentSets, filter],
  equipmentSet: (id: string): AppQueryKey => [ROOT.equipmentSets, id],

  coffeeBags: (filter?: QueryFilter): AppQueryKey => [ROOT.coffeeBags, filter],
  coffeeBag: (id: string): AppQueryKey => [ROOT.coffeeBags, id],

  bagEvaluations: (filter?: QueryFilter): AppQueryKey => [ROOT.bagEvaluations, filter],
  bagEvaluation: (id: string): AppQueryKey => [ROOT.bagEvaluations, id],

  recipes: (filter?: QueryFilter): AppQueryKey => [ROOT.recipes, filter],
  recipe: (id: string): AppQueryKey => [ROOT.recipes, id],
  recipeMessages: (recipeId: string, filter?: QueryFilter): AppQueryKey => [
    ROOT.recipeMessages,
    recipeId,
    filter,
  ],

  brewLogs: (filter?: QueryFilter): AppQueryKey => [ROOT.brewLogs, filter],
  brewLog: (id: string): AppQueryKey => [ROOT.brewLogs, id],

  aiUsage: (filter?: QueryFilter): AppQueryKey => [ROOT.aiUsage, filter],
} as const;

const domainRoot = (name: string): AppQueryKey => [name];

/** The prefix that matches every query in one domain, whatever its filter. */
export const QUERY_ROOTS = {
  tasteProfile: domainRoot(ROOT.tasteProfile),
  tasteProfileEvents: domainRoot(ROOT.tasteProfileEvents),
  brewMethods: domainRoot(ROOT.brewMethods),
  grinders: domainRoot(ROOT.grinders),
  equipment: domainRoot(ROOT.equipment),
  equipmentSets: domainRoot(ROOT.equipmentSets),
  coffeeBags: domainRoot(ROOT.coffeeBags),
  bagEvaluations: domainRoot(ROOT.bagEvaluations),
  recipes: domainRoot(ROOT.recipes),
  recipeMessages: domainRoot(ROOT.recipeMessages),
  brewLogs: domainRoot(ROOT.brewLogs),
  aiUsage: domainRoot(ROOT.aiUsage),
} as const;

export type QueryKeyFactory = typeof QUERY_KEYS;
