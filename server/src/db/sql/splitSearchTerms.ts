const WHITESPACE = /\s+/;
const NOTHING = 0;

/**
 * Splits a search box into the words it is made of, keeping at most `maxTerms`.
 *
 * Every word narrows the result on its own, which is what makes "1zpresso jx"
 * and "jx 1zpresso" find the same grinder: the caller matches each word
 * against the whole "brand model" string rather than against the phrase.
 */
export const splitSearchTerms = (search: string, maxTerms: number): readonly string[] =>
  search
    .trim()
    .split(WHITESPACE)
    .filter((term: string): boolean => term.length > NOTHING)
    .slice(NOTHING, maxTerms);
