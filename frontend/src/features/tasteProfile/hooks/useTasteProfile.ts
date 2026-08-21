import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { TasteProfile } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { fetchTasteProfile } from '../services/tasteProfileApi';

/**
 * What Brewmate believes about this person's taste.
 *
 * An account nobody has taught anything yet gets the neutral profile with no
 * confidence, which is an answer rather than an error.
 */
export const useTasteProfile = (): UseQueryResult<TasteProfile> =>
  useQuery({
    queryKey: QUERY_KEYS.tasteProfile(),
    queryFn: fetchTasteProfile,
  });
