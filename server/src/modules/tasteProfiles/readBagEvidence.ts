import { TASTE_PROFILE_SOURCES, type TasteProfileEventPayload } from '@brewmate/shared';

import type { FoldableEvent } from './foldableEvent.js';

const KEY_SEPARATOR = ':';
const FULL_PURCHASE = 1;

/** What the trail says about bags, read before anything is folded. */
export interface BagEvidence {
  /** Ratings a later rating of the same bag at the same stage replaced. */
  readonly supersededIds: ReadonlySet<string>;
  /** How much of each bag's purchase its latest rating left standing. */
  readonly purchaseFactors: ReadonlyMap<string, number>;
  /** How many different bags have been rated at all. */
  readonly ratedBagCount: number;
}

const isRating = (event: FoldableEvent): boolean =>
  event.source === TASTE_PROFILE_SOURCES.bagRating;

/**
 * Reads the bags out of the trail before the fold walks it.
 *
 * Two decisions need the whole trail rather than the events before the one in
 * hand, which is why they are made here, once, up front. A purchase is weighed
 * by how its bag was rated afterwards - and a rating always arrives after the
 * purchase it judges. And a bag rated twice at the same stage is one opinion
 * corrected rather than two: only the latest counts, and every earlier one
 * stays in the trail with an empty delta beside it.
 */
export const readBagEvidence = (events: readonly FoldableEvent[]): BagEvidence => {
  const latestByStage = new Map<string, string>();
  const purchaseFactors = new Map<string, number>();
  const ratedBags = new Set<string>();

  for (const event of events.filter(isRating)) {
    const { bagId, ratingStage, purchaseFactor } = event.payload;

    if (bagId === undefined) {
      continue;
    }

    ratedBags.add(bagId);

    if (ratingStage !== undefined) {
      latestByStage.set([bagId, ratingStage].join(KEY_SEPARATOR), event.id);
    }

    if (purchaseFactor !== undefined) {
      purchaseFactors.set(bagId, purchaseFactor);
    }
  }

  const latest = new Set(latestByStage.values());

  return {
    supersededIds: new Set(
      events
        .filter(
          (event: FoldableEvent): boolean =>
            isRating(event) && event.payload.ratingStage !== undefined && !latest.has(event.id),
        )
        .map((event: FoldableEvent): string => event.id),
    ),
    purchaseFactors,
    ratedBagCount: ratedBags.size,
  };
};

/**
 * A purchase, weighed by what its bag's ratings left of it.
 *
 * Untouched until the bag is rated - choosing a coffee is evidence the moment
 * it is chosen - and scaled from then on.
 */
export const weighPurchase = (
  payload: TasteProfileEventPayload,
  purchaseFactors: ReadonlyMap<string, number>,
): TasteProfileEventPayload => ({
  ...payload,
  weight:
    (payload.weight ?? FULL_PURCHASE) *
    (payload.bagId === undefined
      ? FULL_PURCHASE
      : (purchaseFactors.get(payload.bagId) ?? FULL_PURCHASE)),
});
