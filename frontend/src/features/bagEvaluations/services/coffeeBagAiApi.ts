import {
  API_ROUTES,
  evaluateCoffeeResponseSchema,
  parseCoffeeBagResponseSchema,
  type EvaluateCoffeeRequest,
  type EvaluateCoffeeResponse,
  type ParseCoffeeBagResponse,
  type Photo,
} from '@brewmate/shared';

import { HTTP_METHODS } from '../../../constants/http';
import { getApiClient } from '../../../lib/apiClient';

/**
 * Reads a photographed label.
 *
 * The picture travels with the request. It used to go to a storage bucket
 * first and only its URL came here, which meant the same bytes crossed the
 * network twice - the API has to hold them either way, to hash them for the
 * cache and to hand the provider base-64 at the end.
 */
export const parseCoffeeBag = async (photo: Photo): Promise<ParseCoffeeBagResponse> =>
  getApiClient().request({
    path: API_ROUTES.aiParseCoffeeBag,
    method: HTTP_METHODS.post,
    body: { photo },
    schema: parseCoffeeBagResponseSchema,
  });

/**
 * Asks whether this coffee is worth buying.
 *
 * Nothing about the person is sent. The profile, its confidence, the brew
 * count and everything this account has already been advised about are read by
 * the API off the caller's own rows - a profile the app could declare would be
 * a profile anybody could declare.
 */
export const evaluateCoffee = async (
  input: EvaluateCoffeeRequest,
): Promise<EvaluateCoffeeResponse> =>
  getApiClient().request({
    path: API_ROUTES.aiEvaluateCoffee,
    method: HTTP_METHODS.post,
    body: input,
    schema: evaluateCoffeeResponseSchema,
  });
