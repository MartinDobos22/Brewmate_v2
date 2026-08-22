import {
  API_ROUTES,
  brewMethodSchema,
  listResponseSchema,
  type BrewMethod,
  type BrewMethodFilter,
  type ListResponse,
} from '@brewmate/shared';

import { getApiClient, withQuery } from '../../../lib/apiClient';

/**
 * The brewing methods, read from the API rather than declared in the app.
 *
 * This is the client half of methods being data: a new one appears here
 * because a row appeared, not because the app shipped.
 */
export const fetchBrewMethods = async (
  filter?: BrewMethodFilter,
): Promise<ListResponse<BrewMethod>> =>
  getApiClient().request({
    path: withQuery(API_ROUTES.brewMethods, filter),
    schema: listResponseSchema(brewMethodSchema),
  });
