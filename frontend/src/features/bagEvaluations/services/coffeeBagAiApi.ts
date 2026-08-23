import {
  API_ROUTES,
  evaluateCoffeeResponseSchema,
  parseCoffeeBagResponseSchema,
  type EvaluateCoffeeRequest,
  type EvaluateCoffeeResponse,
  type ParseCoffeeBagResponse,
} from '@brewmate/shared';

import { HTTP_METHODS } from '../../../constants/http';
import { getApiClient } from '../../../lib/apiClient';

/**
 * Reads a photographed label.
 *
 * Only the URL travels: the picture is already in storage, which is what keeps
 * this request small enough to survive a shop's signal and makes a retry cost
 * one short call rather than a second upload.
 */
export const parseCoffeeBag = async (imageUrl: string): Promise<ParseCoffeeBagResponse> =>
  getApiClient().request({
    path: API_ROUTES.aiParseCoffeeBag,
    method: HTTP_METHODS.post,
    body: { imageUrl },
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
