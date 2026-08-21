import type {
  CreateRecipeChatMessageRequest,
  ListQuery,
  ListResponse,
  RecipeChatMessage,
} from '@brewmate/shared';

import { toPage } from '../../db/rows/toPage.js';
import type { RecipeService } from '../recipes/recipeService.js';

import { toRecipeChatMessage } from './recipeChatMessageMapper.js';
import type { RecipeChatRepository } from './recipeChatRepository.js';

export interface RecipeChatService {
  list(
    userId: string,
    recipeId: string,
    query: ListQuery,
  ): Promise<ListResponse<RecipeChatMessage>>;
  append(
    userId: string,
    recipeId: string,
    input: CreateRecipeChatMessageRequest,
  ): Promise<RecipeChatMessage>;
}

/**
 * Ownership of a conversation is ownership of its recipe.
 *
 * Every call resolves the recipe through the recipe service first, which
 * scopes it to the caller and answers 404 for anything else. That one hop is
 * what lets the messages table stay free of a duplicated `user_id`.
 */
export const createRecipeChatService = (
  repository: RecipeChatRepository,
  recipeService: RecipeService,
): RecipeChatService => ({
  list: async (userId, recipeId, { limit, offset }): Promise<ListResponse<RecipeChatMessage>> => {
    await recipeService.requireOwned(userId, recipeId);

    return toPage({
      rows: (await repository.list({ recipeId, limit, offset })).map(toRecipeChatMessage),
      limit,
      offset,
    });
  },

  append: async (userId, recipeId, input): Promise<RecipeChatMessage> => {
    await recipeService.requireOwned(userId, recipeId);

    return toRecipeChatMessage(await repository.create({ ...input, recipeId }));
  },
});
