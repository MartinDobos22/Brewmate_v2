import { readNoteFlavors } from '../flavors/readNoteFlavors.js';
import type { FlavorTag } from '../flavors/flavorTags.js';
import type { FlavorAffinities } from '../tasteProfiles/flavorAffinitiesSchema.js';

import { DISLIKE_REFLECTION, NOTE_FLAVOR_AFFINITY } from './constants/estimateWeights.js';

const NOTHING = 0;
const LIKED = 1;
const DISLIKED = -1;

/**
 * What the flavours printed on a bag say about the person who liked it, or
 * did not.
 *
 * The same reasoning the axes get from the label's estimate, applied to the
 * one thing an axis cannot carry: a loved coffee whose bag says "čokoláda,
 * lieskový orech" is evidence of liking chocolate and nuts; a disliked one is
 * weaker evidence of the opposite, because disliking a coffee rules out one
 * place rather than naming another. Three stars say nothing at all, and
 * nothing is returned - an affinity blended towards zero would be the profile
 * forgetting what it knew because somebody was lukewarm.
 *
 * `estimateTrust` is the impression's say on how far to believe the label: a
 * coffee that did not taste like what was printed on it says little about the
 * flavours printed on it.
 */
export const readNoteFlavorEvidence = (
  notes: readonly string[],
  sentiment: number,
  estimateTrust: number,
): FlavorAffinities => {
  if (sentiment === NOTHING) {
    return {};
  }

  const value =
    NOTE_FLAVOR_AFFINITY *
    estimateTrust *
    (sentiment > NOTHING ? LIKED : DISLIKED * DISLIKE_REFLECTION);

  return Object.fromEntries(
    readNoteFlavors(notes).map((tag: FlavorTag): [string, number] => [tag, value]),
  );
};
