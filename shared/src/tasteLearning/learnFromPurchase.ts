import type { CoffeeTasteEstimate } from '../coffeeTaste/coffeeTasteEstimateSchema.js';
import {
  TASTE_AXIS_NAMES,
  type PartialTasteAxes,
  type TasteAxisName,
} from '../tasteProfiles/tasteAxesSchema.js';
import {
  isAxisKnown,
  type PartialTasteAxisConfidence,
} from '../tasteProfiles/tasteAxisConfidenceSchema.js';
import type { TasteProfileEventPayload } from '../tasteProfiles/tasteProfileEventPayloadSchema.js';

import { readNoteFlavorEvidence } from './readNoteFlavorEvidence.js';

const FULL = 1;
const CHOSEN = 1;
const NOTHING = 0;

/**
 * What choosing a bag says about the person who chose it.
 *
 * "This is the kind of coffee I want", on the axes its label actually speaks
 * about and at the confidence the label supports - an axis the estimate knows
 * nothing about is left out rather than recorded as a vote for the middle -
 * and for the flavours it prints, which is where "čokoláda" on a bag somebody
 * keeps buying becomes a liking for chocolate.
 *
 * It is weak evidence and the fold treats it as such: people also buy what
 * the shop had. How much of it survives is then decided by the ratings of the
 * same bag, which is why the bag travels on the event.
 *
 * @returns null for a label that says nothing about taste at all - a purchase
 * of a coffee nobody can describe teaches nothing about anybody.
 */
export const learnFromPurchase = (
  coffee: CoffeeTasteEstimate,
  tastingNotes: readonly string[],
  bagId: string,
): TasteProfileEventPayload | null => {
  const known = TASTE_AXIS_NAMES.filter((axis: TasteAxisName): boolean =>
    isAxisKnown(coffee.axisConfidence[axis]),
  );
  const flavorAffinities = readNoteFlavorEvidence(tastingNotes, CHOSEN, FULL);

  if (known.length === NOTHING && Object.keys(flavorAffinities).length === NOTHING) {
    return null;
  }

  const axes: PartialTasteAxes = {};
  const axisWeights: PartialTasteAxisConfidence = {};

  for (const axis of known) {
    axes[axis] = coffee.axes[axis];
    axisWeights[axis] = coffee.axisConfidence[axis];
  }

  return { axes, axisWeights, flavorAffinities, weight: FULL, bagId };
};
