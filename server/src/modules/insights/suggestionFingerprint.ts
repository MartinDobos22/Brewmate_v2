const FNV_OFFSET_BASIS = 2166136261;
const FNV_PRIME = 16777619;
const HEX_RADIX = 16;
const UNSIGNED_SHIFT = 0;
const PREFIX = 'ins-1-';

/**
 * A short, stable name for one piece of evidence.
 *
 * FNV-1a, the same hash the app already fingerprints a questionnaire with, for
 * the same reason: identical evidence is the same evidence and must count
 * once, while different evidence is a different question and deserves to be
 * asked. The version in the prefix is what lets the algorithm behind a
 * suggestion change without a stale dismissal silently suppressing the new one.
 *
 * Not a security primitive and not trying to be. A collision here would show
 * somebody a suggestion they had already refused, which is a nuisance rather
 * than a leak - and the input is a handful of counts about this one account.
 */
export const fingerprintEvidence = (parts: readonly string[]): string => {
  let hash = FNV_OFFSET_BASIS;

  for (const character of parts.join('|')) {
    hash ^= character.codePointAt(UNSIGNED_SHIFT) ?? UNSIGNED_SHIFT;
    hash = Math.imul(hash, FNV_PRIME);
  }

  return `${PREFIX}${(hash >>> UNSIGNED_SHIFT).toString(HEX_RADIX)}`;
};
