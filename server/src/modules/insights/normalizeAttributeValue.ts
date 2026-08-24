const WHITESPACE = /\s+/g;
const SINGLE_SPACE = ' ';
const EMPTY = '';

/**
 * The key two spellings of the same thing are counted under.
 *
 * "Ethiopia", "ethiopia" and "Ethiopia " are one origin, and a report that
 * ranked them as three would be counting its own inconsistency. The key is
 * only ever used for grouping - what gets printed is the spelling that was
 * actually stored, because this vocabulary belongs to the world rather than to
 * the code and the app has no better word for it than the roaster did.
 */
export const normalizeAttributeValue = (value: string): string =>
  value.trim().toLocaleLowerCase().replace(WHITESPACE, SINGLE_SPACE);

/** Whether there is anything here worth counting at all. */
export const isCountableValue = (value: string | null): value is string =>
  value !== null && value.trim() !== EMPTY;
