import type { RoastLevel } from '../enums/roastLevels.js';

/**
 * The three things about a coffee that move a grind, and nothing else.
 *
 * Not a `CoffeeBag`, deliberately. The guidance is asked for in three places -
 * before a recipe is written, while a shot is being dialled in, and on a
 * screen where the coffee may be four words somebody typed - and a function
 * that demanded a full row would be unusable in two of them. Every field is
 * nullable because every one of them is genuinely often unknown, and a coffee
 * that says nothing still gets an answer: the middle of the method's window,
 * reported as exactly that.
 *
 * `daysSinceRoast` is a number rather than a date so this stays arithmetic
 * over plain values - the caller already has the age, on both sides of the
 * wire, and a pure function that reaches for a clock is one that cannot be
 * tested without controlling one.
 */
export interface GrindCoffeeFacts {
  readonly roastLevel: RoastLevel | null;
  /** Free text off the bag: "washed", "prané", "anaeróbne natural". */
  readonly process: string | null;
  readonly daysSinceRoast: number | null;
}

/** A coffee nobody has written anything down about. */
export const UNKNOWN_COFFEE: GrindCoffeeFacts = {
  roastLevel: null,
  process: null,
  daysSinceRoast: null,
};
