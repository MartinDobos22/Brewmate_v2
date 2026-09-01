import {
  TASTE_AXIS_NAMES,
  type TasteAxes,
  type TasteAxisName,
} from '../tasteProfiles/tasteAxesSchema.js';
import type { TasteAxisConfidence } from '../tasteProfiles/tasteAxisConfidenceSchema.js';
import type { CoffeeTasteEstimate } from '../coffeeTaste/coffeeTasteEstimateSchema.js';
import type { MilkUsage } from '../enums/milkUsage.js';

import { applyMilkToCoffee } from './applyMilkToCoffee.js';
import {
  MATCH_BANDS,
  MATCH_DIRECTIONS,
  type AxisMatch,
  type CoffeeMatch,
  type MatchBand,
  type MatchDirection,
} from './coffeeMatchTypes.js';
import {
  ALIGNED_GAP,
  MATCH_FIT_GOOD,
  MATCH_FIT_POOR,
  MAX_MEANINGFUL_GAP,
  MIN_COMPARABLE_WEIGHT,
  MIN_MATCH_COVERAGE,
} from './constants/matchLimits.js';

const NOTHING = 0;
const WHOLE = 1;
const NEUTRAL_FIT = 0.5;

/** What the comparison needs from the person: the five axes and what each is worth. */
export interface DrinkerTaste extends TasteAxes {
  readonly axisConfidence: TasteAxisConfidence;
  readonly milkUsage: MilkUsage | null;
}

const direction = (gap: number): MatchDirection => {
  if (Math.abs(gap) <= ALIGNED_GAP) {
    return MATCH_DIRECTIONS.aligned;
  }

  return gap > NOTHING ? MATCH_DIRECTIONS.above : MATCH_DIRECTIONS.below;
};

/**
 * How well one axis meets, on a scale where 1 is the same drink and 0 is the
 * opposite one.
 *
 * Linear rather than curved, because the number is only ever read through a
 * band or a sentence and a curve would be precision nobody sees. It bottoms
 * out at the maximum meaningful gap: past that the comparison has nothing more
 * to say than "no", and letting it go on falling would make one very wrong
 * axis outvote four right ones.
 */
const axisFit = (gap: number): number =>
  Math.max(WHOLE - Math.abs(gap) / MAX_MEANINGFUL_GAP, NOTHING);

/**
 * How much an axis is worth arguing from: what the person knows about it
 * multiplied by what the label knows about it.
 *
 * A product rather than an average, and that is the single most important line
 * in this module. An average lets one confident side carry a blank one - a
 * fully-read label against an axis the person has never mentioned would come
 * out as a half-strength reason, and the app would argue about somebody's
 * bitterness on the strength of having read a bag. A product makes either
 * blank side end the comparison, which is the only honest reading of it.
 */
const axisWeight = (profileConfidence: number, coffeeConfidence: number): number =>
  profileConfidence * coffeeConfidence;

/**
 * How strong an argument this axis makes, in either direction.
 *
 * A well-known axis sitting exactly halfway between a match and a mismatch is
 * worth saying nothing about; a well-known axis at either extreme is the
 * sentence the whole verdict should lead with. Ordering by this rather than by
 * weight alone is what stops a verdict opening with "your body preference is
 * roughly met", which is true, dull and not why anybody asked.
 */
const argumentStrength = (match: AxisMatch): number =>
  match.weight * Math.abs(match.fit - NEUTRAL_FIT);

const compareAxis = (
  axis: TasteAxisName,
  coffeeAxes: TasteAxes,
  coffee: CoffeeTasteEstimate,
  drinker: DrinkerTaste,
): AxisMatch => {
  const coffeeValue = coffeeAxes[axis];
  const profileValue = drinker[axis];
  const gap = coffeeValue - profileValue;
  const weight = axisWeight(drinker.axisConfidence[axis], coffee.axisConfidence[axis]);

  return {
    axis,
    coffeeValue,
    profileValue,
    gap,
    direction: direction(gap),
    weight,
    fit: axisFit(gap),
    isComparable: weight >= MIN_COMPARABLE_WEIGHT,
  };
};

const weightedFit = (comparable: readonly AxisMatch[]): number | null => {
  const total = comparable.reduce(
    (sum: number, match: AxisMatch): number => sum + match.weight,
    NOTHING,
  );

  if (total === NOTHING) {
    return null;
  }

  return (
    comparable.reduce(
      (sum: number, match: AxisMatch): number => sum + match.fit * match.weight,
      NOTHING,
    ) / total
  );
};

const resolveBand = (fit: number | null, coverage: number): MatchBand => {
  if (fit === null || coverage < MIN_MATCH_COVERAGE) {
    return MATCH_BANDS.unknown;
  }

  if (fit >= MATCH_FIT_GOOD) {
    return MATCH_BANDS.match;
  }

  return fit <= MATCH_FIT_POOR ? MATCH_BANDS.mismatch : MATCH_BANDS.mixed;
};

/**
 * Holds a coffee up against the person who is thinking about drinking it.
 *
 * The third thing this app is built on, and the one the other two exist to
 * make possible. A person is folded onto five axes with a confidence each; a
 * coffee is folded onto the same five with a confidence each; and this is
 * where the two meet, axis by axis, weighted by what both sides actually know.
 *
 * Three rules carry the whole thing:
 *
 * An axis is only compared where both sides know it. Every other way of
 * handling a blank - treating it as neutral, averaging the confidences,
 * filling it in from the other side - ends with the app inventing a reason,
 * and an invented reason in front of a shelf is worse than saying nothing.
 *
 * The coffee is adjusted for how this person drinks it before anything is
 * compared, because a label describes a coffee brewed black and a profile
 * describes the cup somebody actually puts to their mouth.
 *
 * Nothing here is a score. `fit` and `band` exist so the app can choose which
 * sentence to write and which axis to lead with; a percentage in front of a
 * shelf reads as a measurement of somebody's taste, and nobody has measured
 * that.
 */
export const matchCoffeeToProfile = (
  coffee: CoffeeTasteEstimate,
  drinker: DrinkerTaste,
): CoffeeMatch => {
  const coffeeAxes = applyMilkToCoffee(coffee.axes, drinker.milkUsage);
  const axes = TASTE_AXIS_NAMES.map((axis: TasteAxisName): AxisMatch =>
    compareAxis(axis, coffeeAxes, coffee, drinker),
  );
  const comparable = axes
    .filter((match: AxisMatch): boolean => match.isComparable)
    .sort(
      (first: AxisMatch, second: AxisMatch): number =>
        argumentStrength(second) - argumentStrength(first),
    );
  const coverage = comparable.length / axes.length;
  const fit = weightedFit(comparable);

  return {
    axes,
    coffeeAxes,
    coffeeConfidence: coffee.axisConfidence,
    comparable,
    coverage,
    fit,
    band: resolveBand(fit, coverage),
  };
};
