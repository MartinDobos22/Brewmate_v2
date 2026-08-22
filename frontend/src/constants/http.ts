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

/** Punctuation of a query string. Even this is not written at a call site. */
export const QUERY_STRING_PREFIX = '?';
export const QUERY_STRING_SEPARATOR = '&';
