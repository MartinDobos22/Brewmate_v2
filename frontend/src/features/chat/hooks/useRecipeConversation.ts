import { useState } from 'react';
import {
  ANALYTICS_EVENT_NAMES,
  type Recipe,
  type RecipeChatMessage,
  type RecipePatch,
} from '@brewmate/shared';

import { trackEvent } from '../../../lib/analytics';
import { useCreateRecipe } from '../../brewing/hooks';
import { buildAdjustedRecipe } from '../services/buildAdjustedRecipe';

import { useRecipeCoach } from './useRecipeCoach';
import { useRecipeMessages } from './useRecipeMessages';

const NO_MESSAGES: readonly RecipeChatMessage[] = [];

export interface RecipeConversation {
  readonly messages: readonly RecipeChatMessage[];
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly error: unknown;
  readonly isAnswering: boolean;
  readonly hasFailed: boolean;
  readonly isApplying: boolean;
  readonly applyFailed: boolean;
  /** The version created by the last applied patch, if there is one. */
  readonly adjusted: Recipe | null;
  /**
   * Which message's proposal was taken.
   *
   * Named rather than counted, because a conversation carries several patches
   * and only one of them was accepted. Marking every card as applied would
   * tell somebody they had agreed to changes they never saw.
   */
  readonly appliedMessageId: string | null;
  readonly retry: () => void;
  readonly say: (message: string) => void;
  readonly applyPatch: (messageId: string, patch: RecipePatch) => void;
}

/**
 * The conversation about one recipe, and the one tap that acts on it.
 *
 * Applying a patch creates a child recipe rather than editing this one. The
 * recipe somebody brewed stays exactly as it was, which is what keeps the brew
 * log describing the cup it actually came from - and the chain is what lets
 * the next answer see how the numbers got here.
 */
export const useRecipeConversation = (
  recipe: Recipe | undefined,
  brewLogId: string | null,
): RecipeConversation => {
  const query = useRecipeMessages(recipe?.id ?? null);
  const coach = useRecipeCoach();
  const createRecipe = useCreateRecipe();
  const [adjusted, setAdjusted] = useState<Recipe | null>(null);
  const [appliedMessageId, setAppliedMessageId] = useState<string | null>(null);

  return {
    adjusted,
    appliedMessageId,
    messages: query.data?.items ?? NO_MESSAGES,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    isAnswering: coach.isPending,
    hasFailed: coach.isError,
    isApplying: createRecipe.isPending,
    applyFailed: createRecipe.isError,

    retry: (): void => {
      void query.refetch();
    },

    say: (message: string): void => {
      if (recipe === undefined) {
        return;
      }

      coach.mutate({ recipeId: recipe.id, message, brewLogId });
    },

    applyPatch: (messageId: string, patch: RecipePatch): void => {
      if (recipe === undefined) {
        return;
      }

      createRecipe.mutate(buildAdjustedRecipe(recipe, patch), {
        onSuccess: (created: Recipe): void => {
          /**
           * Counted here rather than on the tap, because the interesting
           * number is how often somebody takes a suggestion - and a child
           * recipe that failed to be created is one nobody took.
           */
          trackEvent(ANALYTICS_EVENT_NAMES.recipePatchApplied);
          setAdjusted(created);
          setAppliedMessageId(messageId);
        },
      });
    },
  };
};
