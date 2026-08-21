import type {
  FlavorAffinities,
  PartialTasteAxes,
  TasteAxes,
  TasteProfileDelta,
  TasteProfileEventPayload,
  TasteProfileSource,
} from '@brewmate/shared';

import { blendValue, clampWeight } from './blendValue.js';
import {
  DEFAULT_EVENT_WEIGHT,
  MAX_WEIGHT,
  MIN_WEIGHT,
  SOURCE_TRUST,
} from './constants/reducerWeights.js';
import type { TasteProfileState } from './tasteProfileState.js';

const TASTE_AXIS_NAMES: readonly (keyof TasteAxes)[] = [
  'acidity',
  'sweetness',
  'body',
  'bitterness',
  'intensity',
];

const NO_AFFINITY = 0;

export interface AppliedEvent {
  readonly state: TasteProfileState;
  readonly delta: TasteProfileDelta;
}

const blendAxes = (
  state: TasteProfileState,
  observed: PartialTasteAxes,
  weight: number,
): { readonly axes: TasteAxes; readonly delta: PartialTasteAxes } => {
  const axes = { ...state };
  const delta: Record<string, number> = {};

  for (const axis of TASTE_AXIS_NAMES) {
    const value = observed[axis];

    if (value !== undefined) {
      axes[axis] = blendValue(state[axis], value, weight);
      delta[axis] = axes[axis] - state[axis];
    }
  }

  return { axes, delta };
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
  source: TasteProfileSource,
  payload: TasteProfileEventPayload,
): AppliedEvent => {
  const weight = clampWeight(
    SOURCE_TRUST[source] * (payload.weight ?? DEFAULT_EVENT_WEIGHT),
    MIN_WEIGHT,
    MAX_WEIGHT,
  );

  const { axes, delta } = blendAxes(state, payload.axes, weight);
  const { affinities, delta: affinityDelta } = blendAffinities(
    state.flavorAffinities,
    payload.flavorAffinities ?? {},
    weight,
  );

  return {
    state: {
      ...state,
      ...axes,
      flavorAffinities: affinities,
      roastPreference:
        payload.roastPreference === undefined ? state.roastPreference : payload.roastPreference,
      milkUsage: payload.milkUsage === undefined ? state.milkUsage : payload.milkUsage,
    },
    delta: { axes: delta, flavorAffinities: affinityDelta, weight },
  };
};
