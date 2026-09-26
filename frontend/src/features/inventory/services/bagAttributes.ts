import type { CoffeeBag } from '@brewmate/shared';

const EMPTY = '';

/**
 * The three facts a bag wears on its card, as chips rather than as a sentence.
 *
 * Roast, process, roaster - in that order, because that is the order somebody
 * standing at a shelf reads a label in: how dark, how it was made, who made
 * it. The roast arrives already translated, since it is the one of the three
 * that is a closed set rather than a word off a bag.
 *
 * Nothing is invented to fill a gap. A coffee somebody typed the name of and
 * nothing else gets no chips at all, which says more than three dashes would.
 */
export const bagAttributes = (bag: CoffeeBag, roastLabel: string | null): readonly string[] =>
  [roastLabel, bag.process, bag.roaster].filter(
    (value: string | null): value is string => value !== null && value.trim() !== EMPTY,
  );
