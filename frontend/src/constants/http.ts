/** HTTP verbs the app uses. */
export const HTTP_METHODS = {
  get: 'GET',
  post: 'POST',
  patch: 'PATCH',
  delete: 'DELETE',
} as const;

export type HttpMethod = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS];

/** Status boundaries the client branches on. */
export const HTTP_STATUS = {
  successMin: 200,
  successMax: 299,
  unauthorized: 401,
} as const;

export const CONTENT_TYPE_JSON = 'application/json';
