const EMPTY = '';
const WHITESPACE_RUN = /\s+/gu;
const SINGLE_SPACE = ' ';

/**
 * A roaster or a coffee name, reduced to the form two people would agree on.
 *
 * "Cafe Sladko " and "cafe  sladko" are one roaster, so they are one cache
 * entry. Anything that is blank once trimmed is not a key at all - several
 * unreadable labels are several different bags, and letting them collide would
 * hand somebody the wrong coffee.
 */
export const normalizeLabelKey = (value: string | null | undefined): string | null => {
  const normalized = (value ?? EMPTY).trim().toLowerCase().replace(WHITESPACE_RUN, SINGLE_SPACE);

  return normalized === EMPTY ? null : normalized;
};
