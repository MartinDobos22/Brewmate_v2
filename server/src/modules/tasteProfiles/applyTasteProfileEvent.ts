import {
  TASTE_AXIS_NAMES,
  type FlavorAffinities,
  type PartialTasteAxes,
  type TasteAxes,
  type TasteProfileDelta,
  type TasteProfileEventPayload,
  type TasteProfileSource,
} from '@brewmate/shared';

import { blendValue, clampWeight } from './blendValue.js';
import {
  DEFAULT_AXIS_WEIGHT,
  DEFAULT_EVENT_WEIGHT,
  MAX_WEIGHT,
  MIN_WEIGHT,
  NO_EVIDENCE,
  SOURCE_TRUST,
} from './constants/reducerWeights.js';
import type { AxisEvidence, TasteProfileState } from './tasteProfileState.js';

const NO_AFFINITY = 0;
const ADOPT_OUTRIGHT = 1;

export interface AppliedEvent {
  readonly state: TasteProfileState;
  readonly axisEvidence: AxisEvidence;
  readonly delta: TasteProfileDelta;
}

/**
 * How far this observation moves an axis that has never been spoken about.
 *
 * Outright, and this is the single most consequential line in the reducer.
 *
 * Every axis starts at the middle of the scale, and the middle is a
 * placeholder rather than a position - it is where a profile sits when nobody
 * has said anything, not a belief that this person likes their coffee exactly
 * medium. Blending the first observation towards it therefore averages a real
 * statement with a stand-in for silence: somebody who says plainly that they
 * cannot stand a sour cup was recorded four tenths of the way back towards
 * neutral, and the app then printed "mierne kyslá" at them. Five axes treated
 * that way produce a chart that is a slightly dented pentagon whatever anybody
 * answers, which is worse than no chart - it looks like an opinion.
 *
 * So the first thing heard about an axis is taken at its word, and how much
 * that word is worth is recorded separately, as evidence, and shown as such.
 * Everything after it blends normally: the second observation is the first
 * point at which there are two real statements to weigh against each other.
 */
const resolveAxisStep = (priorEvidence: number, weight: number): number =>
  priorEvidence === NO_EVIDENCE ? ADOPT_OUTRIGHT : weight;

const blendAxes = (
  state: TasteProfileState,
  evidence: AxisEvidence,
  payload: TasteProfileEventPayload,
  weight: number,
): {
  readonly axes: TasteAxes;
  readonly evidence: AxisEvidence;
  readonly delta: PartialTasteAxes;
} => {
  const axes = { ...state };
  const gained = { ...evidence };
  const delta: PartialTasteAxes = {};

  for (const axis of TASTE_AXIS_NAMES) {
    const value = payload.axes[axis];

    if (value === undefined) {
      continue;
    }

    /**
     * How firmly the observation speaks about this axis in particular,
     * against how far its source is trusted at all. An event that does not
     * distinguish between its axes speaks about all of them equally.
     */
    const heard = weight * (payload.axisWeights?.[axis] ?? DEFAULT_AXIS_WEIGHT);

    axes[axis] = blendValue(state[axis], value, resolveAxisStep(evidence[axis], heard));
    delta[axis] = axes[axis] - state[axis];
    /**
     * Evidence counts what was heard, never how far the value moved. Adopting
     * an axis outright moves it the whole way on the strength of one remark,
     * and recording that as certainty is exactly the mistake this reducer
     * exists to stop making.
     */
    gained[axis] = evidence[axis] + heard;
  }

  return { axes, evidence: gained, delta };
};

const blendAffinities = (
  current: FlavorAffinities,
  observed: FlavorAffinities,
  weight: number,
): { readonly affinities: FlavorAffinities; readonly delta: FlavorAffinities } => {
  const affinities: FlavorAffinities = { ...current };
  const delta: FlavorAffinities = {};

  for (const [tag, value] of Object.entries(observed)) {
    const before = current[tag] ?? NO_AFFINITY;

    affinities[tag] = blendValue(before, value, weight);
    delta[tag] = affinities[tag] - before;
  }

  return { affinities, delta };
};

/**
 * Folds one observation into a profile.
 *
 * Pure: same state plus same event gives the same result every time, which is
 * what makes a full recompute reproducible rather than merely plausible. The
 * returned delta is what gets written next to the event, so a later replay can
 * be compared with what happened at the time instead of being trusted.
 */
export const applyTasteProfileEvent = (
  state: TasteProfileState,
  evidence: AxisEvidence,
  source: TasteProfileSource,
  payload: TasteProfileEventPayload,
): AppliedEvent => {
  const weight = clampWeight(
    SOURCE_TRUST[source] * (payload.weight ?? DEFAULT_EVENT_WEIGHT),
    MIN_WEIGHT,
    MAX_WEIGHT,
  );

  const blended = blendAxes(state, evidence, payload, weight);
  const { affinities, delta: affinityDelta } = blendAffinities(
    state.flavorAffinities,
    payload.flavorAffinities ?? {},
    weight,
  );

  return {
    state: {
      ...state,
      ...blended.axes,
      flavorAffinities: affinities,
      roastPreference:
        payload.roastPreference === undefined ? state.roastPreference : payload.roastPreference,
      milkUsage: payload.milkUsage === undefined ? state.milkUsage : payload.milkUsage,
    },
    axisEvidence: blended.evidence,
    delta: { axes: blended.delta, flavorAffinities: affinityDelta, weight },
  };
};
