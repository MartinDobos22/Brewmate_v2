import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { BagRating, BagRatingFilter, ListResponse } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { fetchBagRatings } from '../services/bagRatingsApi';

/** The ratings this account has given - every bag's, or one bag's. */
export const useBagRatings = (filter?: BagRatingFilter): UseQueryResult<ListResponse<BagRating>> =>
  useQuery({
    queryKey: QUERY_KEYS.bagRatings(filter),
    queryFn: async (): Promise<ListResponse<BagRating>> => fetchBagRatings(filter),
  });
