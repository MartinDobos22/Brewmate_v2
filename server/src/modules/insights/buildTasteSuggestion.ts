import {
  FLAVOR_AFFINITY_MAX,
  INSIGHT_REASON_KINDS,
  SUGGESTION_AFFINITY_STEP,
  SUGGESTION_MIN_BREWS,
  SUGGESTION_MIN_SHARE,
  type FlavorAffinities,
  type RoastLevel,
  type SuggestionReason,
  type TasteProfile,
  ROAST_LEVELS,
} from '@brewmate/shared';

import { NOTE_MIN_BAGS, NO_BREWS, SUGGESTION_NOTES_MAX } from './constants/insightLimits.js';
import { fingerprintEvidence } from './suggestionFingerprint.js';
import type { BrewHistoryFold, ValueTally } from './foldBrewHistory.js';

const NO_SHARE = 0;

/**
 * What the history proposes, before anybody has put it into words.
 *
 * Deliberately not a `TasteSuggestion`: the explanation and where it came from
 * are decided later, by whether a model was reachable. Everything here is
 * arithmetic and is the same either way.
 */
export interface SuggestionDraft {
  readonly ref: string;
  readonly roastPreference: RoastLevel | null;
  readonly flavorAffinities: FlavorAffinities;
  readonly weight: number;
  readonly reasons: readonly SuggestionReason[];
}

const isRoastLevel = (value: string): value is RoastLevel =>
  Object.values(ROAST_LEVELS).some((level: RoastLevel): boolean => level === value);

/**
 * The roast this person actually reaches for, if there is one.
 *
 * A clear majority or nothing. Two roast levels at forty per cent each is not
 * a preference, it is a person who buys what the shop had - and telling them
 * otherwise is exactly the kind of confident nonsense this screen exists to
 * avoid.
 *
 * A proposal is only made where it disagrees with what the profile already
 * says. Offering to change something to what it already is would be an
 * interruption with nothing behind it.
 */
const resolveRoastProposal = (
  fold: BrewHistoryFold,
  profile: TasteProfile,
): { readonly roast: RoastLevel | null; readonly reason: SuggestionReason | null } => {
  const [dominant] = fold.roasts;

  if (dominant === undefined || fold.brewCount === NO_BREWS) {
    return { roast: null, reason: null };
  }

  const share = dominant.brewCount / fold.brewCount;

  if (share < SUGGESTION_MIN_SHARE || !isRoastLevel(dominant.value)) {
    return { roast: null, reason: null };
  }

  if (profile.roastPreference === dominant.value) {
    return { roast: null, reason: null };
  }

  return {
    roast: dominant.value,
    reason: {
      kind: INSIGHT_REASON_KINDS.roastHistory,
      value: dominant.value,
      brewCount: dominant.brewCount,
      share,
    },
  };
};

/**
 * Flavour notes worth nudging an affinity for.
 *
 * A note is the roaster's word, printed on a bag somebody bought, so one bag
 * carrying it says something about that roaster's copywriting rather than
 * about the drinker - it takes several different coffees before a note is
 * evidence about a person.
 *
 * The proposed value never lowers an affinity that is already higher. The fold
 * blends towards whatever an observation states, so proposing a modest
 * positive value for a note somebody has already told us they love would pull
 * it *down* - an app quietly arguing with something it was told outright.
 */
const resolveNoteProposals = (
  fold: BrewHistoryFold,
  profile: TasteProfile,
): { readonly affinities: FlavorAffinities; readonly reasons: readonly SuggestionReason[] } => {
  const chosen = fold.notes
    .filter((note: ValueTally): boolean => note.bagCount >= NOTE_MIN_BAGS)
    .slice(NO_BREWS, SUGGESTION_NOTES_MAX);

  const affinities: FlavorAffinities = {};
  const reasons: SuggestionReason[] = [];

  for (const note of chosen) {
    const current = profile.flavorAffinities[note.value] ?? NO_SHARE;
    const proposed = Math.min(Math.max(current, SUGGESTION_AFFINITY_STEP), FLAVOR_AFFINITY_MAX);

    if (proposed <= current) {
      continue;
    }

    affinities[note.value] = proposed;
    reasons.push({
      kind: INSIGHT_REASON_KINDS.flavorNotes,
      value: note.value,
      brewCount: note.brewCount,
      share: fold.brewCount === NO_BREWS ? NO_SHARE : note.brewCount / fold.brewCount,
    });
  }

  return { affinities, reasons };
};

/**
 * How much this evidence is worth, before the source's own trust is applied.
 *
 * The share of the history that actually agrees with the proposal, rather than
 * a figure derived from how many cups there were. Sixty measured cups that
 * split evenly across three roast levels are a lot of evidence for nothing in
 * particular, and a weight that only counted cups would treat them as a lot of
 * evidence for whichever one won.
 */
const resolveWeight = (reasons: readonly SuggestionReason[]): number =>
  reasons.reduce(
    (highest: number, reason: SuggestionReason): number => Math.max(highest, reason.share),
    NO_SHARE,
  );

/**
 * What this account's history proposes, or nothing at all.
 *
 * Nothing at all is the ordinary answer, and it stays the ordinary answer for
 * a long time. Below a handful of cups there is no pattern to find, and above
 * it there is often still nothing the profile does not already say - in which
 * case the honest thing is silence rather than an interruption that agrees
 * with itself.
 */
export const buildTasteSuggestion = (
  fold: BrewHistoryFold,
  profile: TasteProfile,
): SuggestionDraft | null => {
  if (fold.brewCount < SUGGESTION_MIN_BREWS) {
    return null;
  }

  const roast = resolveRoastProposal(fold, profile);
  const notes = resolveNoteProposals(fold, profile);
  const reasons = [...(roast.reason === null ? [] : [roast.reason]), ...notes.reasons];

  if (reasons.length === NO_BREWS) {
    return null;
  }

  return {
    /**
     * Fingerprinted over the counts rather than over the conclusion, so the
     * same evidence read twice is the same question - and a refusal survives
     * until the history itself moves on.
     */
    ref: fingerprintEvidence([
      String(fold.brewCount),
      ...reasons.map(
        (reason: SuggestionReason): string =>
          `${reason.kind}:${reason.value}:${String(reason.brewCount)}`,
      ),
    ]),
    roastPreference: roast.roast,
    flavorAffinities: notes.affinities,
    weight: resolveWeight(reasons),
    reasons,
  };
};
