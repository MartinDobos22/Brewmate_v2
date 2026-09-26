import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { BrewingProfile } from '@brewmate/shared';

import { QUERY_KEYS } from '../../../constants/queryKeys';
import { fetchBrewingProfile } from '../services/brewingProfileApi';

/**
 * What somebody's own cups say about how they brew.
 *
 * Read by the brewing screen and nowhere else, and never drawn as anything:
 * it seeds the amounts and moves the grind's starting point, and each of the
 * two says so in one quiet line. Somebody who has never brewed gets an empty
 * profile, which every reader treats exactly as it treats a failed request -
 * the method's own middle, as before there was a profile at all.
 */
export const useBrewingProfile = (): UseQueryResult<BrewingProfile> =>
  useQuery({
    queryKey: QUERY_KEYS.brewingProfile(),
    queryFn: fetchBrewingProfile,
  });
