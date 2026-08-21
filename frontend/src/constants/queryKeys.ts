/**
 * TanStack Query cache keys. Every key is built here so an invalidation can
 * never miss a query because two call sites spelled the key differently.
 */
const ROOT = {
  health: 'health',
  currentUser: 'currentUser',
} as const;

export const QUERY_KEYS = {
  health: (): readonly string[] => [ROOT.health],
  currentUser: (): readonly string[] => [ROOT.currentUser],
} as const;

export type QueryKeyFactory = typeof QUERY_KEYS;
