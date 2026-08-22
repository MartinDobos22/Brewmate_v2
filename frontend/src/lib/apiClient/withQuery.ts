import { QUERY_STRING_PREFIX, QUERY_STRING_SEPARATOR } from '../../constants/http';

const NOTHING_TO_APPEND = 0;

/** A value the API accepts in a query string. */
export type QueryValue = string | number | boolean | undefined;

/**
 * Appends a query string to a path from `@brewmate/shared`.
 *
 * Undefined entries are dropped rather than sent as the word "undefined",
 * which is what lets a hook pass its whole filter object straight through.
 */
export const withQuery = (path: string, query?: Readonly<Record<string, QueryValue>>): string => {
  const entries = Object.entries(query ?? {}).filter(
    ([, value]: readonly [string, QueryValue]): boolean => value !== undefined,
  );

  if (entries.length === NOTHING_TO_APPEND) {
    return path;
  }

  const search = entries
    .map(
      ([name, value]: readonly [string, QueryValue]): string =>
        `${encodeURIComponent(name)}=${encodeURIComponent(String(value))}`,
    )
    .join(QUERY_STRING_SEPARATOR);

  return `${path}${QUERY_STRING_PREFIX}${search}`;
};
