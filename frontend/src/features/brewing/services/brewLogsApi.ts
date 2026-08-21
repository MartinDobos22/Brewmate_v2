import {
  API_ROUTES,
  brewLogSchema,
  buildApiPath,
  deletedResponseSchema,
  listResponseSchema,
  type BrewLog,
  type BrewLogFilter,
  type CreateBrewLogRequest,
  type DeletedResponse,
  type ListResponse,
  type UpdateBrewLogRequest,
} from '@brewmate/shared';

import { HTTP_METHODS } from '../../../constants/http';
import { getApiClient, withQuery } from '../../../lib/apiClient';

const logPath = (id: string): string => buildApiPath(API_ROUTES.brewLogById, { id });

export const fetchBrewLogs = async (filter?: BrewLogFilter): Promise<ListResponse<BrewLog>> =>
  getApiClient().request({
    path: withQuery(API_ROUTES.brewLogs, filter),
    schema: listResponseSchema(brewLogSchema),
  });

export const fetchBrewLog = async (id: string): Promise<BrewLog> =>
  getApiClient().request({ path: logPath(id), schema: brewLogSchema });

/**
 * Records a brew.
 *
 * The bag comes from the recipe and the learning weight is priced from the
 * declared constraints, both on the server - the app sends what happened and
 * reads back what it meant.
 */
export const createBrewLog = async (input: CreateBrewLogRequest): Promise<BrewLog> =>
  getApiClient().request({
    path: API_ROUTES.brewLogs,
    method: HTTP_METHODS.post,
    body: input,
    schema: brewLogSchema,
  });

export const updateBrewLog = async (id: string, changes: UpdateBrewLogRequest): Promise<BrewLog> =>
  getApiClient().request({
    path: logPath(id),
    method: HTTP_METHODS.patch,
    body: changes,
    schema: brewLogSchema,
  });

export const deleteBrewLog = async (id: string): Promise<DeletedResponse> =>
  getApiClient().request({
    path: logPath(id),
    method: HTTP_METHODS.delete,
    schema: deletedResponseSchema,
  });
