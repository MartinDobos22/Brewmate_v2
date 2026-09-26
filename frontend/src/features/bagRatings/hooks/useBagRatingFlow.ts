import type { BagRating, BagRatingStage, CoffeeBag } from '@brewmate/shared';
import { useState } from 'react';

import { EVERY_RATING } from '../constants/everyRating';
import { findRating } from '../services/findRating';
import type { BagRatingRequest } from '../services/bagRatingRequest';

import { useBagRatings } from './useBagRatings';

const NO_RATINGS: readonly BagRating[] = [];

export interface BagRatingFlow {
  readonly ratings: readonly BagRating[];
  /** The bag and stage the sheet is open for, or null while it is closed. */
  readonly request: BagRatingRequest | null;
  /** The answer already given for the open request, to start the sheet from. */
  readonly existing: BagRating | null;
  readonly open: (bag: CoffeeBag, stage: BagRatingStage) => void;
  readonly close: () => void;
}

/**
 * Asking about one bag at a time, from a screen that shows several.
 *
 * The ratings are read once for every bag on the screen - which is what lets
 * a card know it has not been asked about yet - and the sheet opens for
 * whichever bag somebody tapped.
 */
export const useBagRatingFlow = (): BagRatingFlow => {
  const ratings = useBagRatings(EVERY_RATING).data?.items ?? NO_RATINGS;
  const [request, setRequest] = useState<BagRatingRequest | null>(null);

  return {
    ratings,
    request,
    existing: request === null ? null : findRating(ratings, request.bag.id, request.stage),
    open: (bag: CoffeeBag, stage: BagRatingStage): void => {
      setRequest({ bag, stage });
    },
    close: (): void => {
      setRequest(null);
    },
  };
};
