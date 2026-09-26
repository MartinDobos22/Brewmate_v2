import { normalizeSignalText } from '../coffeeTaste/normalizeSignalText.js';

import { FLAVOR_LEXICON } from './flavorLexicon.js';
import type { FlavorTag } from './flavorTags.js';

/** Anything that is not a letter separates two words. */
const WORD_SEPARATOR = /[^\p{L}]+/u;

/**
 * Every flavour the printed notes name, once each.
 *
 * Read on word starts rather than anywhere in the text, so a stem cannot be
 * found in the middle of an unrelated word. A note may name two flavours -
 * "ružový grep" is a flower and a citrus - and a flavour named by three notes
 * is still one flavour, because it is one claim by one roaster about one lot.
 */
export const readNoteFlavors = (notes: readonly string[]): readonly FlavorTag[] => {
  const words = notes.flatMap((note: string): readonly string[] =>
    normalizeSignalText(note).split(WORD_SEPARATOR),
  );
  const found = FLAVOR_LEXICON.filter(([stem]: readonly [string, FlavorTag]): boolean =>
    words.some((word: string): boolean => word.startsWith(stem)),
  ).map(([, tag]: readonly [string, FlavorTag]): FlavorTag => tag);

  return [...new Set(found)];
};
