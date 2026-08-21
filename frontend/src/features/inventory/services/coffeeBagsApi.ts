import {
  API_ROUTES,
  buildApiPath,
  coffeeBagSchema,
  listResponseSchema,
  type CoffeeBag,
  type CoffeeBagFilter,
  type CreateCoffeeBagRequest,
  type ListResponse,
  type UpdateCoffeeBagRequest,
} from '@brewmate/shared';

import { HTTP_METHODS } from '../../../constants/http';
import { getApiClient, withQuery } from '../../../lib/apiClient';

const bagPath = (id: string): string => buildApiPath(API_ROUTES.coffeeBagById, { id });

export const fetchCoffeeBags = async (filter?: CoffeeBagFilter): Promise<ListResponse<CoffeeBag>> =>
  getApiClient().request({
    path: withQuery(API_ROUTES.coffeeBags, filter),
    schema: listResponseSchema(coffeeBagSchema),
  });

export const fetchCoffeeBag = async (id: string): Promise<CoffeeBag> =>
  getApiClient().request({ path: bagPath(id), schema: coffeeBagSchema });

export const createCoffeeBag = async (input: CreateCoffeeBagRequest): Promise<CoffeeBag> =>
  getApiClient().request({
    path: API_ROUTES.coffeeBags,
    method: HTTP_METHODS.post,
    body: input,
    schema: coffeeBagSchema,
  });

export const updateCoffeeBag = async (
  id: string,
  changes: UpdateCoffeeBagRequest,
): Promise<CoffeeBag> =>
  getApiClient().request({
    path: bagPath(id),
    method: HTTP_METHODS.patch,
    body: changes,
    schema: coffeeBagSchema,
  });

/**
 * Archives the bag and answers with it.
 *
 * The row survives - brew logs point at it - so this returns the archived bag
 * rather than nothing at all.
 */
export const archiveCoffeeBag = async (id: string): Promise<CoffeeBag> =>
  getApiClient().request({
    path: bagPath(id),
    method: HTTP_METHODS.delete,
    schema: coffeeBagSchema,
  });
