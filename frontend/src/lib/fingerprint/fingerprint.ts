import { FINGERPRINT, FINGERPRINT_SEPARATORS } from '../../constants/fingerprint';

const ORDER_FIRST = -1;
const ORDER_LAST = 1;
const ORDER_SAME = 0;
const FIRST_CHARACTER = 0;

/** Sorted, so the result depends on the entries and not on the order they were built in. */
const serialize = (entries: Readonly<Record<string, string>>): string =>
  Object.entries(entries)
    .sort(([first]: readonly [string, string], [second]: readonly [string, string]): number => {
      if (first === second) {
        return ORDER_SAME;
      }

      return first < second ? ORDER_FIRST : ORDER_LAST;
    })
    .map(([key, value]: readonly [string, string]): string =>
      [key, value].join(FINGERPRINT_SEPARATORS.pair),
    )
    .join(FINGERPRINT_SEPARATORS.entry);

/**
 * A short, stable identifier for a set of values.
 *
 * FNV-1a, not a cryptographic hash: nothing here is a secret and nobody
 * benefits from forging a collision. It only has to be deterministic, and
 * short enough to fit inside a `sourceRef` next to whatever names it.
 */
export const fingerprint = (entries: Readonly<Record<string, string>>): string => {
  const serialized = serialize(entries);
  let hash = FINGERPRINT.offsetBasis;

  for (const character of serialized) {
    hash = (hash ^ character.charCodeAt(FIRST_CHARACTER)) >>> 0;
    hash = Math.imul(hash, FINGERPRINT.prime) >>> 0;
  }

  return hash.toString(FINGERPRINT.radix);
};
