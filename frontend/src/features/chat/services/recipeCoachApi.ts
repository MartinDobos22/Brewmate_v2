import {
  API_ROUTES,
  recipeChatResponseSchema,
  type RecipeChatRequest,
  type RecipeChatResponse,
} from '@brewmate/shared';

import { HTTP_METHODS } from '../../../constants/http';
import { getApiClient } from '../../../lib/apiClient';

/**
 * Sends one thing somebody said about a cup, and reads the answer.
 *
 * Both halves of the exchange come back already stored, so the screen draws
 * the real messages rather than an optimistic copy of the question next to a
 * real answer - and a message can never reach the model without reaching the
 * conversation.
 */
export const askRecipeCoach = async (input: RecipeChatRequest): Promise<RecipeChatResponse> =>
  getApiClient().request({
    path: API_ROUTES.aiRecipeChat,
    method: HTTP_METHODS.post,
    body: input,
    schema: recipeChatResponseSchema,
  });
