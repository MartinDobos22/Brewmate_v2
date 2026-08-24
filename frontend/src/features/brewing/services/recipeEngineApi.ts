import {
  API_ROUTES,
  generateRecipeResponseSchema,
  type GenerateRecipeRequest,
  type GenerateRecipeResponse,
} from '@brewmate/shared';

import { HTTP_METHODS } from '../../../constants/http';
import { getApiClient } from '../../../lib/apiClient';

/**
 * Asks for a recipe, and gets one that already exists.
 *
 * The API stores the recipe before answering, so what comes back has an id -
 * which is what brew mode logs against and what the conversation afterwards
 * hangs off. Nothing about the person, the coffee or the gear is sent beyond
 * the ids of what was chosen: the server reads all of that off the caller's
 * own rows, which is the only reason the recipe is worth following.
 */
export const generateRecipe = async (
  input: GenerateRecipeRequest,
): Promise<GenerateRecipeResponse> =>
  getApiClient().request({
    path: API_ROUTES.aiGenerateRecipe,
    method: HTTP_METHODS.post,
    body: input,
    schema: generateRecipeResponseSchema,
  });
