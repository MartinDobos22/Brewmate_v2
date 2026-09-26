import type { UseMutationResult } from '@tanstack/react-query';
import type { BagRating, RateBagRequest } from '@brewmate/shared';

import { QUERY_ROOTS } from '../../../constants/queryKeys';
import { useInvalidatingMutation } from '../../../hooks/useEntityMutation';
import { rateBag } from '../services/bagRatingsApi';

/**
 * Rates a bag.
 *
 * Not optimistic: what a rating does to the taste profile is the server's
 * arithmetic, and the profile is refetched with the ratings because the chart
 * and the shop verdict are about to read it.
 */
export const useRateBag = (): UseMutationResult<BagRating, Error, RateBagRequest> =>
  useInvalidatingMutation({
    mutationFn: rateBag,
    invalidates: [QUERY_ROOTS.bagRatings, QUERY_ROOTS.tasteProfile, QUERY_ROOTS.tasteProfileEvents],
  });
