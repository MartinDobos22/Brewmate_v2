import { API_ROUTES, brewingProfileSchema, type BrewingProfile } from '@brewmate/shared';

import { getApiClient } from '../../../lib/apiClient';

/** How this account brews, as its own cups add up. Read-only: brewing is the only way to change it. */
export const fetchBrewingProfile = async (): Promise<BrewingProfile> =>
  getApiClient().request({
    path: API_ROUTES.brewingProfile,
    schema: brewingProfileSchema,
  });
