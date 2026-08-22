/** What `LIKE` and `ILIKE` treat as special, and the escape character for them. */
const LIKE_ESCAPE_CHARACTER = '\\';
const LIKE_SPECIAL_CHARACTERS = /[\\%_]/g;
const ANY_SEQUENCE = '%';

/**
 * Turns a search term into an `ILIKE` pattern that matches it anywhere.
 *
 * The term is user input, so its own wildcards are escaped first: somebody
 * looking for a model written with an underscore must not accidentally ask the
 * database for "any single character".
 */
export const toContainsPattern = (term: string): string => {
  const escaped = term.replace(
    LIKE_SPECIAL_CHARACTERS,
    (character: string): string => `${LIKE_ESCAPE_CHARACTER}${character}`,
  );

  return `${ANY_SEQUENCE}${escaped}${ANY_SEQUENCE}`;
};
