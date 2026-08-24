import {
  GRAMS_DECIMALS,
  resolveDoseGrams,
  resolveRatio,
  resolveWaterGrams,
} from '../brewing/ratioCalculator.js';

import { BREWER_USABLE_CAPACITY_FRACTION, MILLILITRES_PER_GRAM } from './conversionFieldLimits.js';
import type { ConversionNote } from './conversionNoteSchema.js';
import { CONVERSION_PRECISIONS, type ConversionPrecision } from './conversionPrecision.js';
import { CONVERSION_REASONS, type ConversionReason } from './conversionReasons.js';
import type { ConversionTarget } from './conversionTarget.js';
import { DEFAULT_DOSE_GRAMS } from './methodDefaults.js';
import type { SourceRecipe } from './sourceRecipeSchema.js';

const HALF = 2;
const ROUNDING_BASE = 10;
const UNSCALED = 1;
const DOSE = 'dose';
const WATER = 'water';
const RATIO = 'ratio';

/** The amounts, fitted to this brewer, with the ratio they were fitted at. */
export interface ConvertedAmounts {
  readonly doseGrams: number;
  readonly waterGrams: number;
  readonly ratio: number;
  readonly notes: readonly ConversionNote[];
}

/** The pair of weights the source recipe was actually brewed with. */
interface SourceAmounts {
  readonly doseGrams: number;
  readonly waterGrams: number;
  /** False where nothing in the source said, and both numbers are a default. */
  readonly stated: boolean;
  readonly ratioPrecision: ConversionPrecision;
  readonly ratioReason: ConversionReason;
}

const roundGrams = (value: number): number => {
  const factor = ROUNDING_BASE ** GRAMS_DECIMALS;

  return Math.round(value * factor) / factor;
};

const note = (
  field: ConversionNote['field'],
  precision: ConversionPrecision,
  reason: ConversionReason,
): ConversionNote => ({ field, precision, reason });

const middleOf = (range: { readonly min: number; readonly max: number }): number =>
  (range.min + range.max) / HALF;

/**
 * The two weights the source recipe was brewed at.
 *
 * Both are resolved before anything is scaled, and the pair is what travels
 * onwards rather than a dose and a ratio. That is deliberate: a ratio is
 * rounded to one decimal for display, and a recipe rebuilt out of a rounded
 * ratio comes back with 501 g of water where its author wrote 500. The pair of
 * grams is the physical fact, and it survives the journey intact.
 */
const readSourceAmounts = (recipe: SourceRecipe, target: ConversionTarget): SourceAmounts => {
  if (recipe.doseGrams !== null && recipe.waterGrams !== null) {
    return {
      doseGrams: recipe.doseGrams,
      waterGrams: recipe.waterGrams,
      stated: true,
      ratioPrecision: CONVERSION_PRECISIONS.exact,
      ratioReason: CONVERSION_REASONS.ratioPreserved,
    };
  }

  const statedRatio = recipe.ratio;

  if (recipe.doseGrams !== null && statedRatio !== null) {
    return {
      doseGrams: recipe.doseGrams,
      waterGrams: resolveWaterGrams(recipe.doseGrams, statedRatio),
      stated: true,
      ratioPrecision: CONVERSION_PRECISIONS.exact,
      ratioReason: CONVERSION_REASONS.keptFromSource,
    };
  }

  if (recipe.waterGrams !== null && statedRatio !== null) {
    return {
      doseGrams: resolveDoseGrams(recipe.waterGrams, statedRatio),
      waterGrams: recipe.waterGrams,
      stated: true,
      ratioPrecision: CONVERSION_PRECISIONS.exact,
      ratioReason: CONVERSION_REASONS.keptFromSource,
    };
  }

  const fallbackRatio = statedRatio ?? middleOf(target.ratioRange);
  const window = target.brewer;
  const fallbackDose =
    recipe.doseGrams ??
    (recipe.waterGrams === null
      ? window.doseMinGrams !== null && window.doseMaxGrams !== null
        ? middleOf({ min: window.doseMinGrams, max: window.doseMaxGrams })
        : DEFAULT_DOSE_GRAMS[target.methodCategory]
      : resolveDoseGrams(recipe.waterGrams, fallbackRatio));

  return {
    doseGrams: fallbackDose,
    waterGrams: recipe.waterGrams ?? resolveWaterGrams(fallbackDose, fallbackRatio),
    stated: recipe.doseGrams !== null || recipe.waterGrams !== null,
    ratioPrecision:
      statedRatio === null ? CONVERSION_PRECISIONS.unknown : CONVERSION_PRECISIONS.exact,
    ratioReason:
      statedRatio === null
        ? CONVERSION_REASONS.notStatedInSource
        : CONVERSION_REASONS.keptFromSource,
  };
};

/**
 * A ratio from one family of brewer, brought inside the window of another.
 *
 * Only across families. Within one, the ratio is the recipe's character and
 * moving it would be converting somebody else's recipe into a different
 * recipe - the amounts are scaled to the brewer *at the source's own ratio*.
 * Across families it is not character but a category error: an espresso's 1:2
 * poured through a V60 is not a strong V60, it is mud.
 */
const fitRatioToMethod = (amounts: SourceAmounts, target: ConversionTarget): SourceAmounts => {
  const ratio = resolveRatio(amounts.doseGrams, amounts.waterGrams);
  const { min, max } = target.ratioRange;

  if (ratio >= min && ratio <= max) {
    return amounts;
  }

  const clamped = Math.min(Math.max(ratio, min), max);

  return {
    ...amounts,
    waterGrams: resolveWaterGrams(amounts.doseGrams, clamped),
    ratioPrecision: CONVERSION_PRECISIONS.estimated,
    ratioReason: CONVERSION_REASONS.clampedToMethodWindow,
  };
};

/**
 * The most water this brewer can take, counting the room wet grounds occupy.
 *
 * @returns the limit in grams, or null where nobody has measured the brewer -
 * in which case the recipe keeps the amounts its author chose. Guessing a
 * capacity and scaling a recipe against the guess would be worse than doing
 * nothing: it would move numbers for a reason that does not exist.
 */
const usableWaterGrams = (target: ConversionTarget): number | null =>
  target.brewer.capacityMl === null
    ? null
    : target.brewer.capacityMl * BREWER_USABLE_CAPACITY_FRACTION * MILLILITRES_PER_GRAM;

/**
 * How much both weights have to shrink or grow, as one factor.
 *
 * One factor for the pair rather than two independent adjustments, because
 * that is what keeps the ratio the source's own. The dose window is applied
 * first and the capacity second, so capacity wins where the two disagree: a
 * brewer that overflows loses the brew and possibly the counter, while a dose
 * under the basket's comfortable minimum only makes a slightly worse cup.
 */
const scaleFactorFor = (amounts: SourceAmounts, target: ConversionTarget): number => {
  const { doseMinGrams, doseMaxGrams } = target.brewer;
  const capacityLimit = usableWaterGrams(target);

  const withinWindow = Math.min(
    Math.max(amounts.doseGrams, doseMinGrams ?? amounts.doseGrams),
    doseMaxGrams ?? amounts.doseGrams,
  );
  const windowFactor = withinWindow / amounts.doseGrams;

  if (capacityLimit !== null && amounts.waterGrams * windowFactor > capacityLimit) {
    return capacityLimit / amounts.waterGrams;
  }

  return windowFactor;
};

/**
 * Somebody else's amounts, on this person's brewer, at the source's own ratio.
 *
 * The ratio is what survives; the two weights are what move.
 */
export const convertAmounts = (
  recipe: SourceRecipe,
  target: ConversionTarget,
): ConvertedAmounts => {
  const crossesFamily =
    recipe.methodCategory !== null && recipe.methodCategory !== target.methodCategory;
  const source = readSourceAmounts(recipe, target);
  const amounts = crossesFamily ? fitRatioToMethod(source, target) : source;

  const factor = scaleFactorFor(amounts, target);
  const doseGrams = roundGrams(amounts.doseGrams * factor);
  const waterGrams = roundGrams(amounts.waterGrams * factor);
  const capacityLimit = usableWaterGrams(target);
  const hitCapacity = capacityLimit !== null && amounts.waterGrams > capacityLimit;

  const amountPrecision = !source.stated
    ? CONVERSION_PRECISIONS.unknown
    : factor === UNSCALED
      ? CONVERSION_PRECISIONS.exact
      : CONVERSION_PRECISIONS.estimated;
  const amountReason = !source.stated
    ? CONVERSION_REASONS.notStatedInSource
    : hitCapacity
      ? CONVERSION_REASONS.scaledToCapacity
      : factor === UNSCALED
        ? CONVERSION_REASONS.keptFromSource
        : CONVERSION_REASONS.scaledToDoseWindow;

  return {
    doseGrams,
    waterGrams,
    ratio: resolveRatio(doseGrams, waterGrams),
    notes: [
      note(DOSE, amountPrecision, amountReason),
      note(WATER, amountPrecision, amountReason),
      note(RATIO, amounts.ratioPrecision, amounts.ratioReason),
    ],
  };
};
