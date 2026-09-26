import {
  API_ROUTES,
  bagRatingSchema,
  listResponseSchema,
  type BagRating,
  type BagRatingFilter,
  type ListResponse,
  type RateBagRequest,
} from '@brewmate/shared';

import { HTTP_METHODS } from '../../../constants/http';
import { getApiClient, withQuery } from '../../../lib/apiClient';

export const fetchBagRatings = async (filter?: BagRatingFilter): Promise<ListResponse<BagRating>> =>
  getApiClient().request({
    path: withQuery(API_ROUTES.bagRatings, filter),
    schema: listResponseSchema(bagRatingSchema),
  });

/**
 * Saves the rating for one bag at one stage, replacing an earlier one.
 *
 * A put, because the bag and the stage are what name this rating - sending it
 * again is changing your mind, not rating the coffee twice.
 */
export const rateBag = async (input: RateBagRequest): Promise<BagRating> =>
  getApiClient().request({
    path: API_ROUTES.bagRatings,
    method: HTTP_METHODS.put,
    body: input,
    schema: bagRatingSchema,
  });
