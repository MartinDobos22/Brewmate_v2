/** Marks a named parameter inside a route pattern. */
export const API_PATH_PARAM_PREFIX = ':';

/**
 * Turns a Fastify route pattern into a concrete path.
 *
 * `buildApiPath(API_ROUTES.recipeById, { id })` - the pattern stays the single
 * definition of the route and the app never concatenates a path by hand.
 */
export const buildApiPath = (
  pattern: string,
  params: Readonly<Record<string, string>>,
): string =>
  Object.entries(params).reduce(
    (path: string, [name, value]: readonly [string, string]): string =>
      path.replace(`${API_PATH_PARAM_PREFIX}${name}`, encodeURIComponent(value)),
    pattern,
  );
