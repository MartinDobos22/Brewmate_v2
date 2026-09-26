import type { BrewConstraints } from '../brewing/brewConstraintsSchema.js';
import type { BrewMethodCategory } from '../enums/brewMethodCategories.js';

/**
 * One cup somebody actually brewed, reduced to what the brewing profile reads.
 *
 * Plain values rather than a brew log, a recipe and a bag, so the fold stays
 * arithmetic that can be checked in a second with no database behind it. The
 * caller does the joining: which figure was brewed comes off the log where the
 * log recorded it and off the recipe where it did not, and the grind arrives
 * already measured against the bag it was ground from.
 */
export interface BrewedCup {
  readonly methodId: string;
  readonly methodCategory: BrewMethodCategory;
  /**
   * Which coffee this was, so two cups of one bag count as one coffee.
   *
   * The bag where there was one; a cup with no bag behind it is its own
   * coffee, because nobody wrote down what was in the grinder.
   */
  readonly coffeeKey: string;
  /** The weight the cup was priced at on the way in. */
  readonly learningWeight: number;
  /** Whether a correction of this cup's recipe was brewed afterwards. */
  readonly isSuperseded: boolean;
  /** What was missing that morning, which decides which figures it may teach. */
  readonly constraints: BrewConstraints;
  readonly doseGrams: number | null;
  readonly ratio: number | null;
  readonly waterTempC: number | null;
  /** From `readGrindHabitShift`; null where there was no number to measure. */
  readonly grindShift: number | null;
}
