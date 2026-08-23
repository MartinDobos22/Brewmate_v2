import type { FlavorAffinities } from '@brewmate/shared';

import { TRANSLATION_KEYS } from '../../../i18n';
import { normalizeText } from '../../../lib/text';
import { FLAVOR_AFFINITY_DISPLAY_MIN, type FlavorTag } from '../../tasteProfile/constants';
import { BAG_SCAN_FIELDS } from '../constants/bagScan';
import { FLAVOR_LEXICON } from '../constants/flavorLexicon';

import type { BagVerdictParts } from './bagVerdictTypes';

const NOTHING = 0;
const DISLIKED = -1;

/** The flavour tags one printed note maps onto, which may be none. */
const readNote = (note: string): readonly FlavorTag[] => {
  const text = normalizeText(note);

  return FLAVOR_LEXICON.filter(([stem]: readonly [string, FlavorTag]): boolean =>
    text.includes(stem),
  ).map(([, tag]: readonly [string, FlavorTag]): FlavorTag => tag);
};

/** Every tag the label claims, read through the lexicon. */
export const readTastingNoteTags = (notes: readonly string[]): readonly FlavorTag[] =>
  notes.flatMap(readNote);

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

  const tags = readTastingNoteTags(notes);
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
        ? [{ key: TRANSLATION_KEYS.scanPointFlavorLiked, isAgainst: false }]
        : []),
      ...(disliked.length > NOTHING
        ? [{ key: TRANSLATION_KEYS.scanPointFlavorDisliked, isAgainst: true }]
        : []),
    ],
    uncertainties: [],
  };
};
