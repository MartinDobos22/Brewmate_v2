/** The two ids brew mode is addressed by. */
export const BREW_MODE_PARAMS = {
  recipeId: 'recipeId',
  equipmentSetId: 'equipmentSetId',
} as const;

const FIRST = 0;

/**
 * One route parameter, as a string or nothing.
 *
 * expo-router hands back a string or an array of them, because a query name
 * can legally repeat. A repeated id is somebody's malformed link rather than a
 * meaningful request, so the first one wins and the rest are ignored.
 */
export const readRouteParam = (value: string | string[] | undefined): string | null => {
  if (value === undefined) {
    return null;
  }

  return (Array.isArray(value) ? value[FIRST] : value) ?? null;
};
