import {
  TASTE_PROFILE_SOURCES,
  learnFromRating,
  type BagRating,
  type CoffeeBag,
} from '@brewmate/shared';

import type { CoffeeTasteReadingRepository } from '../ai/coffeeTasteEstimate/coffeeTasteReadingRepository.js';
import type { TasteProfileService } from '../tasteProfiles/tasteProfileService.js';

import { estimateBagTaste } from './estimateBagTaste.js';
import { readPurchaseEvidence } from './readPurchaseEvidence.js';

const REF_SEPARATOR = ':';

export interface BagTasteLearner {
  /** A bag written into the cupboard: somebody chose this coffee. */
  recordPurchase(userId: string, bag: CoffeeBag): Promise<void>;
  /** How that coffee turned out, halfway through it or once it was gone. */
  recordRating(userId: string, bag: CoffeeBag, rating: BagRating): Promise<void>;
}

export interface BagTasteLearnerDependencies {
  readonly tasteProfileService: TasteProfileService;
  readonly readings: CoffeeTasteReadingRepository;
}

/**
 * Turns what happens to a bag into evidence about the person who bought it.
 *
 * The only two things that teach the taste profile about coffee somebody
 * actually had in their hands - and the arithmetic of both lives in
 * `@brewmate/shared`, where it is tested against plain values. What is done
 * here is reading the bag's label into an estimate and writing the result
 * down, with the estimate frozen into the event: the trail has to replay to
 * the same profile next year, whatever the tables or the cache say by then.
 */
export const createBagTasteLearner = ({
  tasteProfileService,
  readings,
}: BagTasteLearnerDependencies): BagTasteLearner => ({
  recordPurchase: async (userId, bag): Promise<void> => {
    const payload = await readPurchaseEvidence(bag, readings);

    if (payload === null) {
      return;
    }

    /** The bag is the reference, so a bag counts as bought once whatever happens. */
    await tasteProfileService.addEvent(userId, {
      source: TASTE_PROFILE_SOURCES.purchase,
      sourceRef: bag.id,
      payload,
    });
  },

  recordRating: async (userId, bag, rating): Promise<void> => {
    const payload = learnFromRating({
      coffee: await estimateBagTaste(bag, readings),
      tastingNotes: bag.tastingNotes,
      bagId: bag.id,
      stage: rating.stage,
      stars: rating.stars,
      impression: rating.impression,
      tags: rating.tags,
    });

    /**
     * Each save is its own event - the moment it was given is part of the
     * reference - and the fold keeps only the latest for a bag and a stage.
     * Changing your mind is recorded as having happened, not as a rewrite.
     */
    await tasteProfileService.addEvent(userId, {
      source: TASTE_PROFILE_SOURCES.bagRating,
      sourceRef: [rating.id, rating.updatedAt].join(REF_SEPARATOR),
      payload,
    });
  },
});
