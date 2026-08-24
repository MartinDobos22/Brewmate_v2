import type { UseMutationResult } from '@tanstack/react-query';
import {
  ANALYTICS_EVENT_NAMES,
  type RecipeChatRequest,
  type RecipeChatResponse,
} from '@brewmate/shared';

import { QUERY_ROOTS } from '../../../constants/queryKeys';
import { useInvalidatingMutation } from '../../../hooks/useEntityMutation';
import { askRecipeCoach } from '../services/recipeCoachApi';

/**
 * Says something about a cup and waits for the answer.
 *
 * Not optimistic: a question is only half an exchange, and the person who
 * asked it is waiting on the other half either way. Drawing their own line
 * half a second sooner buys nothing and risks showing a message that never
 * landed.
 *
 * The taste profile is invalidated alongside the conversation, because an
 * answer may have taught it something - the confidence line on the profile
 * screen should not still be quoting yesterday.
 */
export const useRecipeCoach = (): UseMutationResult<RecipeChatResponse, Error, RecipeChatRequest> =>
  useInvalidatingMutation({
    mutationFn: askRecipeCoach,
    invalidates: [
      QUERY_ROOTS.recipeMessages,
      QUERY_ROOTS.tasteProfile,
      QUERY_ROOTS.tasteProfileEvents,
      QUERY_ROOTS.aiUsage,
    ],
    tracks: ANALYTICS_EVENT_NAMES.brewChatMessageSent,
  });
