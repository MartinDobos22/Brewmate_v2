import type { UseMutationResult } from '@tanstack/react-query';
import type { CreateRecipeChatMessageRequest, RecipeChatMessage } from '@brewmate/shared';

import { QUERY_ROOTS } from '../../../constants/queryKeys';
import { useInvalidatingMutation } from '../../../hooks/useEntityMutation';
import { sendRecipeMessage } from '../services/recipeChatApi';

export interface SendRecipeMessageVariables {
  readonly recipeId: string;
  readonly message: CreateRecipeChatMessageRequest;
}

/**
 * Adds a message to a recipe conversation.
 *
 * Not optimistic: a question is only half an exchange, and the person who
 * asked it is waiting on the answer either way. Drawing their own line half a
 * second sooner buys nothing and risks showing a message that never landed.
 */
export const useSendRecipeMessage = (): UseMutationResult<
  RecipeChatMessage,
  Error,
  SendRecipeMessageVariables
> =>
  useInvalidatingMutation({
    mutationFn: async ({
      recipeId,
      message,
    }: SendRecipeMessageVariables): Promise<RecipeChatMessage> =>
      sendRecipeMessage(recipeId, message),
    invalidates: [QUERY_ROOTS.recipeMessages],
  });
