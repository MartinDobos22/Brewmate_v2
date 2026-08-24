import {
  INSIGHT_ATTRIBUTES,
  INSIGHT_VALUES_PER_ATTRIBUTE_MAX,
  type AttributeInsight,
  type InsightAttribute,
} from '@brewmate/shared';

import { NO_BREWS, NO_EVIDENCE } from './constants/insightLimits.js';
import type { BrewHistoryRow, PinnedRecipeRow } from './insightsRepository.js';
import { isCountableValue, normalizeAttributeValue } from './normalizeAttributeValue.js';

const ONE = 1;

/**
 * One value counted across the history.
 *
 * The bags are a set while the tally is being built, because "how many
 * different coffees" and "how many cups" are different questions and only the
 * first one needs to know which bags they were.
 */
interface Tally {
  /** The spelling that was actually stored, kept for printing. */
  value: string;
  readonly bagIds: Set<string>;
  brewCount: number;
  pinnedCount: number;
  evidence: number;
}

/** A finished tally, in the shape the suggestion builder reads. */
export interface ValueTally {
  readonly value: string;
  readonly brewCount: number;
  readonly bagCount: number;
  readonly pinnedCount: number;
  readonly evidence: number;
}

export interface BrewHistoryFold {
  /** How many bag-backed cups the whole report is a description of. */
  readonly brewCount: number;
  readonly totalEvidence: number;
  readonly attributes: readonly AttributeInsight[];
  /** Roast levels, ranked - the one attribute the profile has a field for. */
  readonly roasts: readonly ValueTally[];
  /** Tasting notes, ranked - evidence about flavour rather than about beans. */
  readonly notes: readonly ValueTally[];
}

const emptyTally = (value: string): Tally => ({
  value,
  bagIds: new Set<string>(),
  brewCount: NO_BREWS,
  pinnedCount: NO_BREWS,
  evidence: NO_EVIDENCE,
});

/**
 * Counts one appearance of one value.
 *
 * A pinned recipe is counted as a bag and a pin but never as a cup: it is
 * evidence that somebody kept a way of brewing something, not evidence that
 * they drank it again. Conflating the two would let one pin look like a
 * fortnight of mornings.
 */
const record = (
  tallies: Map<string, Tally>,
  raw: string | null,
  bagId: string,
  weight: number,
  isBrew: boolean,
): void => {
  if (!isCountableValue(raw)) {
    return;
  }

  const key = normalizeAttributeValue(raw);
  const tally = tallies.get(key) ?? emptyTally(raw.trim());

  tally.bagIds.add(bagId);

  if (isBrew) {
    tally.brewCount += ONE;
    tally.evidence += weight;
  } else {
    tally.pinnedCount += ONE;
  }

  tallies.set(key, tally);
};

/**
 * Ranked by evidence rather than by count.
 *
 * Two accounts can have brewed an Ethiopian ten times each and mean different
 * things by it: ten measured cups say more than ten made at a cabin with no
 * scale, and `profile_learning_weight` is the number that already knows the
 * difference. Ranking by the raw count would put the cabin fortnight on top.
 */
const byEvidence = (left: Tally, right: Tally): number => right.evidence - left.evidence;

const toValueTally = (tally: Tally): ValueTally => ({
  value: tally.value,
  brewCount: tally.brewCount,
  bagCount: tally.bagIds.size,
  pinnedCount: tally.pinnedCount,
  evidence: tally.evidence,
});

/** The three attributes, each with its own map, so one cannot crowd out another. */
type AttributeTallies = Record<InsightAttribute, Map<string, Tally>>;

const emptyAttributeTallies = (): AttributeTallies => ({
  [INSIGHT_ATTRIBUTES.origin]: new Map<string, Tally>(),
  [INSIGHT_ATTRIBUTES.process]: new Map<string, Tally>(),
  [INSIGHT_ATTRIBUTES.roastLevel]: new Map<string, Tally>(),
});

const rank = (tallies: Map<string, Tally>): readonly ValueTally[] =>
  [...tallies.values()].sort(byEvidence).map(toValueTally);

const toInsights = (
  attribute: InsightAttribute,
  ranked: readonly ValueTally[],
): readonly AttributeInsight[] =>
  ranked
    .slice(NO_BREWS, INSIGHT_VALUES_PER_ATTRIBUTE_MAX)
    .map((tally: ValueTally): AttributeInsight => ({ attribute, ...tally }));

/**
 * Turns a stretch of brewing into counts.
 *
 * Pure, so the same rows give the same report every time - which is what makes
 * the fingerprint downstream stable, and therefore what makes accepting the
 * same advice twice count once and a dismissal stay dismissed.
 *
 * Nothing here scores anything. Every number that comes out is a count of
 * something that happened: how many bags, how many cups, how much those cups
 * were worth as evidence, and how many of those coffees ended up with a recipe
 * somebody pinned. This product has never measured how much anybody liked a
 * cup, and a report that produced a rating would be inventing the one thing it
 * does not know.
 */
export const foldBrewHistory = (
  brews: readonly BrewHistoryRow[],
  pinned: readonly PinnedRecipeRow[],
): BrewHistoryFold => {
  const attributes = emptyAttributeTallies();
  const notes = new Map<string, Tally>();

  let totalEvidence = NO_EVIDENCE;

  for (const brew of brews) {
    totalEvidence += brew.learningWeight;

    record(attributes.origin, brew.originCountry, brew.bagId, brew.learningWeight, true);
    record(attributes.process, brew.process, brew.bagId, brew.learningWeight, true);
    record(attributes.roast_level, brew.roastLevel, brew.bagId, brew.learningWeight, true);

    for (const note of brew.tastingNotes) {
      record(notes, note, brew.bagId, brew.learningWeight, true);
    }
  }

  for (const recipe of pinned) {
    record(attributes.origin, recipe.originCountry, recipe.bagId, NO_EVIDENCE, false);
    record(attributes.process, recipe.process, recipe.bagId, NO_EVIDENCE, false);
    record(attributes.roast_level, recipe.roastLevel, recipe.bagId, NO_EVIDENCE, false);
  }

  const rankedRoasts = rank(attributes.roast_level);

  return {
    brewCount: brews.length,
    totalEvidence,
    attributes: [
      ...toInsights(INSIGHT_ATTRIBUTES.origin, rank(attributes.origin)),
      ...toInsights(INSIGHT_ATTRIBUTES.process, rank(attributes.process)),
      ...toInsights(INSIGHT_ATTRIBUTES.roastLevel, rankedRoasts),
    ],
    roasts: rankedRoasts,
    notes: rank(notes),
  };
};
