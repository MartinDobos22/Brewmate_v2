import {
  API_ROUTES,
  convertRecipeResponseSchema,
  parseRecipeResponseSchema,
  type ConvertRecipeRequest,
  type ConvertRecipeResponse,
  type ParseRecipeRequest,
  type ParseRecipeResponse,
} from '@brewmate/shared';

import { HTTP_METHODS } from '../../../constants/http';
import { getApiClient } from '../../../lib/apiClient';

/**
 * Reads a recipe out of whatever somebody found it in.
 *
 * The photograph travels as a URL, like a coffee label's: the app uploads it
 * and sends the link, so a retry on a bad connection costs one short request
 * rather than a second upload.
 */
export const parseRecipe = async (input: ParseRecipeRequest): Promise<ParseRecipeResponse> =>
  getApiClient().request({
    path: API_ROUTES.aiParseRecipe,
    method: HTTP_METHODS.post,
    body: input,
    schema: parseRecipeResponseSchema,
  });

/**
 * Converts it onto this person's own equipment.
 *
 * Nothing about their gear is sent: the method and the set are ids the API
 * resolves against their own rows. That is the only reason the answer is worth
 * following - it was computed for the collar actually on their counter.
 */
export const convertRecipe = async (input: ConvertRecipeRequest): Promise<ConvertRecipeResponse> =>
  getApiClient().request({
    path: API_ROUTES.aiConvertRecipe,
    method: HTTP_METHODS.post,
    body: input,
    schema: convertRecipeResponseSchema,
  });
