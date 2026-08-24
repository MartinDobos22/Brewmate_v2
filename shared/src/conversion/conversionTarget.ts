import type { BrewMethodCategory } from '../enums/brewMethodCategories.js';
import type { RatioRange } from '../brewMethods/ratioRangeSchema.js';
import type { Grinder } from '../grinders/grinderSchema.js';

/**
 * The brewer a converted recipe has to fit inside.
 *
 * Every measurement is nullable because a brewer nobody has measured is still
 * a brewer, and the conversion would rather leave a recipe at the amounts its
 * author chose than scale it against a capacity somebody assumed.
 */
export interface ConversionBrewer {
  readonly capacityMl: number | null;
  readonly doseMinGrams: number | null;
  readonly doseMaxGrams: number | null;
}

/**
 * The kitchen the recipe is being converted into.
 *
 * Assembled by whoever calls the conversion, from rows that belong to the
 * person asking. Nothing here is ever taken from a client: gear anybody could
 * declare is gear anybody could declare, and a conversion is only worth
 * reading because it was made for what is actually on the counter.
 */
export interface ConversionTarget {
  readonly methodCategory: BrewMethodCategory;
  /** The method's own sensible ratio window, which a foreign ratio is measured against. */
  readonly ratioRange: RatioRange;
  /** Their grinder's catalogue entry, where their grinder is in the catalogue. */
  readonly grinder: Grinder | null;
  readonly brewer: ConversionBrewer;
  readonly hasTemperatureControl: boolean;
  /**
   * Whether a grind number is an instruction at all.
   *
   * False for pre-ground coffee and for a grinder that is set and staying that
   * way - in which case the conversion says the grind could not be moved
   * rather than printing a setting nobody can dial.
   */
  readonly canAdjustGrind: boolean;
}

/** A brewer nobody has measured, which is most of them. */
export const UNMEASURED_BREWER: ConversionBrewer = {
  capacityMl: null,
  doseMinGrams: null,
  doseMaxGrams: null,
};

/** The grinder the source recipe was written on, where the catalogue knows it. */
export interface ConversionSource {
  readonly grinder: Grinder | null;
}
