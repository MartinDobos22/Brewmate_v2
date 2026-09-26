import type {
  BagRating,
  BagRatingQuery,
  CoffeeBag,
  ListResponse,
  RateBagRequest,
} from '@brewmate/shared';

import { toPage } from '../../db/rows/toPage.js';
import { ERROR_MESSAGES } from '../../errors/errorMessages.js';
import { notFoundError } from '../../errors/notFoundError.js';
import { toCoffeeBag } from '../coffeeBags/coffeeBagMapper.js';
import type { CoffeeBagRepository } from '../coffeeBags/coffeeBagRepository.js';

import { toBagRating } from './bagRatingMapper.js';
import type { BagRatingRepository } from './bagRatingRepository.js';
import type { BagTasteLearner } from './bagTasteLearner.js';

const NO_TAGS: RateBagRequest['tags'] = [];

export interface BagRatingService {
  list(userId: string, query: BagRatingQuery): Promise<ListResponse<BagRating>>;
  /** Saves the rating for this bag and stage, and teaches the profile from it. */
  rate(userId: string, input: RateBagRequest): Promise<BagRating>;
}

export interface BagRatingServiceDependencies {
  readonly repository: BagRatingRepository;
  readonly coffeeBagRepository: CoffeeBagRepository;
  readonly learner: BagTasteLearner;
}

export const createBagRatingService = ({
  repository,
  coffeeBagRepository,
  learner,
}: BagRatingServiceDependencies): BagRatingService => {
  /**
   * The bag is read off the caller's own rows, archived or not - finishing a
   * bag is exactly when the second rating is given. Somebody else's bag is
   * the same 404 as a bag that does not exist.
   */
  const requireOwnedBag = async (userId: string, bagId: string): Promise<CoffeeBag> => {
    const row = await coffeeBagRepository.findById(bagId, userId);

    if (row === null) {
      throw notFoundError(ERROR_MESSAGES.coffeeBagNotFound);
    }

    return toCoffeeBag(row);
  };

  return {
    list: async (userId, { bagId, limit, offset }) =>
      toPage({
        rows: (await repository.list({ userId, bagId, limit, offset })).map(toBagRating),
        limit,
        offset,
      }),

    rate: async (userId, input): Promise<BagRating> => {
      const bag = await requireOwnedBag(userId, input.bagId);
      const rating = toBagRating(
        await repository.save({
          userId,
          bagId: bag.id,
          stage: input.stage,
          stars: input.stars,
          impression: input.impression ?? null,
          tags: [...(input.tags ?? NO_TAGS)],
        }),
      );

      await learner.recordRating(userId, bag, rating);

      return rating;
    },
  };
};
