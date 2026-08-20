/**
 * Single source of truth for API paths.
 * Never write a route path as a literal in client or server code.
 */
export const API_ROUTES = {
  health: '/health',
  me: '/me',
} as const;

export type ApiRoute = (typeof API_ROUTES)[keyof typeof API_ROUTES];
