import type { CoffeeTasteEstimate } from '../coffeeTaste/coffeeTasteEstimateSchema.js';
import { TASTE_AXIS_NAMES, type PartialTasteAxes } from '../tasteProfiles/tasteAxesSchema.js';
import {
  isAxisKnown,
  type PartialTasteAxisConfidence,
} from '../tasteProfiles/tasteAxisConfidenceSchema.js';
import {
  TASTE_AXIS_MAX,
  TASTE_AXIS_MIN,
  TASTE_AXIS_NEUTRAL,
} from '../tasteProfiles/tasteProfileFieldLimits.js';

import { DISLIKE_REFLECTION, HALF_SCALE } from './constants/estimateWeights.js';

export interface AxisEvidence {
  readonly axes: PartialTasteAxes;
  readonly axisWeights: PartialTasteAxisConfidence;
}

const NOTHING = 0;

const clampAxis = (value: number): number =>
  Math.min(Math.max(value, TASTE_AXIS_MIN), TASTE_AXIS_MAX);

/**
 * Where the stars point on the axes the label knows, and how firmly.
 *
 * A liked coffee is "somewhere like this", at the label's own confidence. A
 * disliked one is "not like this": reflected across the middle and pulled most
 * of the way back, and only as firmly as the coffee was far from the middle -
 * disliking a coffee that sat exactly halfway on an axis says nothing about
 * that axis. Three stars say nothing about any axis, and nothing is returned.
 *
 * `estimateTrust` scales every weight, for the case where the drinker has said
 * the coffee did not taste like its label: the stars still count, the place
 * they were pinned to much less.
 */
export const readEstimateEvidence = (
  coffee: CoffeeTasteEstimate,
  sentiment: number,
  estimateTrust: number,
): AxisEvidence => {
  const axes: PartialTasteAxes = {};
  const axisWeights: PartialTasteAxisConfidence = {};

  if (sentiment === NOTHING) {
    return { axes, axisWeights };
  }

  for (const axis of TASTE_AXIS_NAMES) {
    const confidence = coffee.axisConfidence[axis];

    if (!isAxisKnown(confidence)) {
      continue;
    }

    const value = coffee.axes[axis];

    if (sentiment > NOTHING) {
      axes[axis] = value;
      axisWeights[axis] = confidence * estimateTrust;
      continue;
    }

    const distance = Math.abs(value - TASTE_AXIS_NEUTRAL) / HALF_SCALE;

    if (distance === NOTHING) {
      continue;
    }

    axes[axis] = clampAxis(TASTE_AXIS_NEUTRAL - (value - TASTE_AXIS_NEUTRAL) * DISLIKE_REFLECTION);
    axisWeights[axis] = confidence * distance * estimateTrust;
  }

  return { axes, axisWeights };
};
