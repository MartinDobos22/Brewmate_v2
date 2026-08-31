import {
  FLAVOR_AFFINITY_MAX,
  FLAVOR_AFFINITY_MIN,
  foldAxisObservations,
  TASTE_AXIS_MAX,
  TASTE_AXIS_MIN,
  TASTE_AXIS_NAMES,
  type FlavorAffinities,
  type MilkUsage,
  type PartialTasteAxes,
  type AxisObservation,
  type PartialTasteAxisConfidence,
  type RoastLevel,
  type TasteProfileEventPayload,
} from '@brewmate/shared';

import { FULL_AXIS_COVERAGE, MAX_AXIS_DISAGREEMENT } from '../constants/questionnaireEvidence';
import {
  TASTE_EXPERIENCE_TRUST,
  type TasteExperienceLevel,
} from '../constants/tasteExperienceLevels';

import { findAnsweredOptions } from './findAnsweredOptions';
import { resolveLevelQuestions } from './resolveLevelQuestions';

const NOTHING = 0;
const WHOLE = 1;

type Observations = Map<string, AxisObservation[]>;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/** How much of this level's questionnaire was actually filled in. */
const answeredShare = (answered: number, level: TasteExperienceLevel): number => {
  const asked = resolveLevelQuestions(level).length;

  return asked === NOTHING ? NOTHING : answered / asked;
};

const collect = (
  observations: Observations,
  claimed: Readonly<Record<string, number | undefined>>,
  weight: number,
): void => {
  for (const [key, value] of Object.entries(claimed)) {
    if (value !== undefined) {
      observations.set(key, [...(observations.get(key) ?? []), { value, weight }]);
    }
  }
};

/**
 * A flavour tag is a plain weighted mean and nothing more.
 *
 * There is no disagreement to measure here the way there is on an axis: two
 * answers both mentioning chocolate are two people-facing hints towards the
 * same tag, and an answer that does not mention it is silence rather than a
 * vote against it. The affinity is a soft ranking that decides which handful
 * of words the profile prints, not a number anything is recommended from.
 */
const resolveAffinities = (observations: Observations): FlavorAffinities =>
  Object.fromEntries(
    [...observations].flatMap(
      ([tag, seen]: readonly [string, readonly AxisObservation[]]): readonly (readonly [
        string,
        number,
      ])[] => {
        const folded = foldAxisObservations(seen, MAX_AXIS_DISAGREEMENT);

        return folded === null
          ? []
          : [[tag, clamp(folded.value, FLAVOR_AFFINITY_MIN, FLAVOR_AFFINITY_MAX)]];
      },
    ),
  );

/**
 * Every axis the questionnaire had something to say about: where it sits, and
 * how firmly, narrowed onto the five the contract names.
 */
const resolveAxes = (
  observations: Observations,
): { readonly axes: PartialTasteAxes; readonly axisWeights: PartialTasteAxisConfidence } => {
  const axes: PartialTasteAxes = {};
  const axisWeights: PartialTasteAxisConfidence = {};

  for (const axis of TASTE_AXIS_NAMES) {
    const folded = foldAxisObservations(observations.get(axis) ?? [], MAX_AXIS_DISAGREEMENT);

    if (folded === null) {
      continue;
    }

    axes[axis] = clamp(folded.value, TASTE_AXIS_MIN, TASTE_AXIS_MAX);
    /**
     * Two independent reasons to hold an axis loosely, and both have to count.
     * How much was asked about it, and how far what came back agreed with
     * itself: one confident answer and four that cancel out are different
     * kinds of thin evidence, and neither is worth as much as four that lined
     * up.
     */
    axisWeights[axis] = clamp(
      folded.agreement * (folded.coverage / FULL_AXIS_COVERAGE),
      NOTHING,
      WHOLE,
    );
  }

  return { axes, axisWeights };
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
 * What travels alongside the numbers is the point of this function. The mean
 * of two contradictory answers looks exactly like the mean of two answers that
 * agreed, and until now the profile could not tell them apart: both arrived as
 * a confident figure. Now each axis carries how much was asked about it and
 * how far the answers backed each other up, so the profile can hold a value it
 * openly admits it is unsure of - which is the honest description of most of
 * what a questionnaire produces.
 *
 * The level scales the whole submission rather than any single value. What
 * somebody answered is what gets recorded whichever level they chose; the
 * level only decides how much the app may then claim to know them.
 */
export const buildQuestionnairePayload = (
  answers: Readonly<Record<string, string>>,
  level: TasteExperienceLevel,
): TasteProfileEventPayload => {
  const axisObservations: Observations = new Map<string, AxisObservation[]>();
  const flavorObservations: Observations = new Map<string, AxisObservation[]>();
  const answered = findAnsweredOptions(answers, level);
  let roastPreference: RoastLevel | undefined;
  let milkUsage: MilkUsage | undefined;

  for (const { option, weight } of answered) {
    collect(axisObservations, option.effect.axes ?? {}, weight);
    collect(flavorObservations, option.effect.flavorAffinities ?? {}, weight);
    roastPreference = option.effect.roastPreference ?? roastPreference;
    milkUsage = option.effect.milkUsage ?? milkUsage;
  }

  const { axes, axisWeights } = resolveAxes(axisObservations);

  return {
    axes,
    axisWeights,
    flavorAffinities: resolveAffinities(flavorObservations),
    ...(roastPreference === undefined ? {} : { roastPreference }),
    ...(milkUsage === undefined ? {} : { milkUsage }),
    /**
     * The share of this level's questions that were actually answered, against
     * how far the level itself is trusted. An interrupted run says less about
     * somebody than a finished one, which is exactly what it should.
     */
    weight: answeredShare(answered.length, level) * TASTE_EXPERIENCE_TRUST[level],
  };
};
