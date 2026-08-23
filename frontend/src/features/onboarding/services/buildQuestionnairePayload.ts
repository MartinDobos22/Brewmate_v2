import {
  FLAVOR_AFFINITY_MAX,
  FLAVOR_AFFINITY_MIN,
  TASTE_AXIS_MAX,
  TASTE_AXIS_MIN,
  type FlavorAffinities,
  type MilkUsage,
  type PartialTasteAxes,
  type RoastLevel,
  type TasteProfileEventPayload,
} from '@brewmate/shared';

import { TASTE_AXIS_ORDER } from '../../tasteProfile/constants';
import { TASTE_QUESTIONS } from '../constants/tasteQuestions';

import { findAnsweredOptions } from './findAnsweredOptions';

const NOTHING = 0;

/** One axis or one flavour tag, mid-accumulation. */
interface WeightedMean {
  readonly total: number;
  readonly weight: number;
}

type Means = Map<string, WeightedMean>;

const addObservation = (means: Means, key: string, value: number, weight: number): void => {
  const current = means.get(key) ?? { total: NOTHING, weight: NOTHING };

  means.set(key, { total: current.total + value * weight, weight: current.weight + weight });
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const collect = (
  means: Means,
  observations: Readonly<Record<string, number | undefined>>,
  weight: number,
): void => {
  for (const [key, value] of Object.entries(observations)) {
    if (value !== undefined) {
      addObservation(means, key, value, weight);
    }
  }
};

const resolveMeans = (means: Means, min: number, max: number): Record<string, number> =>
  Object.fromEntries(
    [...means].map(
      ([key, { total, weight }]: readonly [string, WeightedMean]): readonly [string, number] => [
        key,
        clamp(weight === NOTHING ? NOTHING : total / weight, min, max),
      ],
    ),
  );

/** Narrows the accumulated map back onto the five axes the contract names. */
const toTasteAxes = (means: Record<string, number>): PartialTasteAxes => {
  const axes: PartialTasteAxes = {};

  for (const axis of TASTE_AXIS_ORDER) {
    const value = means[axis];

    if (value !== undefined) {
      axes[axis] = value;
    }
  }

  return axes;
};

/**
 * Folds a whole questionnaire into one observation.
 *
 * Every answer states where this person's cup sits on an axis, so several
 * answers speaking about the same axis are averaged - weighted by how far each
 * question is trusted - rather than applied one after another. Ten separate
 * events would let the last question shout down the first nine simply by
 * arriving last.
 *
 * `weight` is the share of the questionnaire that was actually answered, so an
 * interrupted run says less about somebody than a finished one, which is
 * exactly what it should.
 */
export const buildQuestionnairePayload = (
  answers: Readonly<Record<string, string>>,
): TasteProfileEventPayload => {
  const axisMeans: Means = new Map<string, WeightedMean>();
  const flavorMeans: Means = new Map<string, WeightedMean>();
  const answered = findAnsweredOptions(answers);
  let roastPreference: RoastLevel | undefined;
  let milkUsage: MilkUsage | undefined;

  for (const { option, weight } of answered) {
    collect(axisMeans, option.effect.axes ?? {}, weight);
    collect(flavorMeans, option.effect.flavorAffinities ?? {}, weight);
    roastPreference = option.effect.roastPreference ?? roastPreference;
    milkUsage = option.effect.milkUsage ?? milkUsage;
  }

  const flavorAffinities: FlavorAffinities = resolveMeans(
    flavorMeans,
    FLAVOR_AFFINITY_MIN,
    FLAVOR_AFFINITY_MAX,
  );

  return {
    axes: toTasteAxes(resolveMeans(axisMeans, TASTE_AXIS_MIN, TASTE_AXIS_MAX)),
    flavorAffinities,
    ...(roastPreference === undefined ? {} : { roastPreference }),
    ...(milkUsage === undefined ? {} : { milkUsage }),
    weight: answered.length / TASTE_QUESTIONS.length,
  };
};
