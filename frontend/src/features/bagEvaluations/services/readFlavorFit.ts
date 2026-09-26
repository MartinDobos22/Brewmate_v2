import { readNoteFlavors, type FlavorAffinities, type FlavorTag } from '@brewmate/shared';

import { TRANSLATION_KEYS } from '../../../i18n';
import { FLAVOR_AFFINITY_DISPLAY_MIN } from '../../tasteProfile/constants';
import { BAG_SCAN_FIELDS } from '../constants/bagScan';

import type { BagVerdictParts } from './bagVerdictTypes';

const NOTHING = 0;
const DISLIKED = -1;

const affinityOf = (affinities: FlavorAffinities, tag: FlavorTag): number =>
  affinities[tag] ?? NOTHING;

/**
 * What the printed tasting notes say about a bag this person would enjoy.
 *
 * Only affinities the profile actually holds an opinion about are read: below
 * the display threshold a value is a rounding artefact of one blended answer,
 * and arguing for or against a bag on that basis would be inventing a reason.
 */
export const readFlavorFit = (
  notes: readonly string[],
  affinities: FlavorAffinities,
): BagVerdictParts => {
  if (notes.length === NOTHING) {
    return {
      points: [],
      uncertainties: [
        { field: BAG_SCAN_FIELDS.tastingNotes, reasonKey: TRANSLATION_KEYS.scanReasonNoNotes },
      ],
    };
  }

  /*
   * Read through the same lexicon the server learns from, so the flavour a
   * verdict argues about and the flavour a purchase taught are one word.
   */
  const tags = readNoteFlavors(notes);
  const liked = tags.filter(
    (tag: FlavorTag): boolean => affinityOf(affinities, tag) >= FLAVOR_AFFINITY_DISPLAY_MIN,
  );
  const disliked = tags.filter(
    (tag: FlavorTag): boolean =>
      affinityOf(affinities, tag) <= FLAVOR_AFFINITY_DISPLAY_MIN * DISLIKED,
  );

  return {
    points: [
      ...(liked.length > NOTHING
        ? [
            {
              key: TRANSLATION_KEYS.scanPointFlavorLiked,
              field: BAG_SCAN_FIELDS.tastingNotes,
              isAgainst: false,
            },
          ]
        : []),
      ...(disliked.length > NOTHING
        ? [
            {
              key: TRANSLATION_KEYS.scanPointFlavorDisliked,
              field: BAG_SCAN_FIELDS.tastingNotes,
              isAgainst: true,
            },
          ]
        : []),
    ],
    uncertainties: [],
  };
};
