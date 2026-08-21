import {
  API_ROUTES,
  buildApiPath,
  listResponseSchema,
  recipeChatMessageSchema,
  type CreateRecipeChatMessageRequest,
  type ListFilter,
  type ListResponse,
  type RecipeChatMessage,
} from '@brewmate/shared';

import { HTTP_METHODS } from '../../../constants/http';
import { getApiClient, withQuery } from '../../../lib/apiClient';

const messagesPath = (recipeId: string): string =>
  buildApiPath(API_ROUTES.recipeMessages, { id: recipeId });

/** The conversation about one recipe, oldest first. */
export const fetchRecipeMessages = async (
  recipeId: string,
  filter?: ListFilter,
): Promise<ListResponse<RecipeChatMessage>> =>
  getApiClient().request({
    path: withQuery(messagesPath(recipeId), filter),
    schema: listResponseSchema(recipeChatMessageSchema),
  });

export const sendRecipeMessage = async (
  recipeId: string,
  input: CreateRecipeChatMessageRequest,
): Promise<RecipeChatMessage> =>
  getApiClient().request({
    path: messagesPath(recipeId),
    method: HTTP_METHODS.post,
    body: input,
    schema: recipeChatMessageSchema,
  });
