/**
 * Constants of the FNV-1a hash used to fingerprint a set of values.
 *
 * A hash rather than the values themselves: a taste event's `sourceRef` is
 * capped at 128 characters and ten question-and-option pairs do not fit. What
 * matters is only that identical input produces an identical reference, which
 * is what makes re-sending something on a flaky connection count once while a
 * genuinely different answer counts as new evidence.
 */
export const FINGERPRINT = {
  offsetBasis: 2166136261,
  prime: 16777619,
  /** Base 36 keeps the reference short without leaving the ASCII alphabet. */
  radix: 36,
} as const;

/** Punctuation of the hashed string. Even this is not written at a call site. */
export const FINGERPRINT_SEPARATORS = {
  pair: '=',
  entry: ';',
} as const;
