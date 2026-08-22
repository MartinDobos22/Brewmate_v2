import {
  API_ROUTES,
  buildApiPath,
  grinderSchema,
  listResponseSchema,
  type CreateGrinderRequest,
  type Grinder,
  type GrinderFilter,
  type ListResponse,
} from '@brewmate/shared';

import { HTTP_METHODS } from '../../../constants/http';
import { getApiClient, withQuery } from '../../../lib/apiClient';

export const fetchGrinders = async (filter?: GrinderFilter): Promise<ListResponse<Grinder>> =>
  getApiClient().request({
    path: withQuery(API_ROUTES.grinders, filter),
    schema: listResponseSchema(grinderSchema),
  });

export const fetchGrinder = async (id: string): Promise<Grinder> =>
  getApiClient().request({
    path: buildApiPath(API_ROUTES.grinderById, { id }),
    schema: grinderSchema,
  });

/**
 * Contributes a grinder to the shared catalogue.
 *
 * It comes back unverified and stays visible only to whoever added it, so
 * there is nothing here for the app to decide.
 */
export const createGrinder = async (input: CreateGrinderRequest): Promise<Grinder> =>
  getApiClient().request({
    path: API_ROUTES.grinders,
    method: HTTP_METHODS.post,
    body: input,
    schema: grinderSchema,
  });
