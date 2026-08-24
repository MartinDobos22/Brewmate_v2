import type { Recipe, RecipeChatMessage, RecipePatch } from '@brewmate/shared';
import { useState } from 'react';

import { TRANSLATION_KEYS, useTranslation } from '../../../i18n';
import { useCreateRecipe, useRecipe, useUpdateRecipe } from '../../brewing/hooks';
import { buildAdjustedRecipe } from '../../chat/services';
import { useRecipeMessages } from '../../chat/hooks';
import { EMPTY_SHOT_FORM, toEspressoShot, type ShotFormValues } from '../services';

import { useSendShot } from './useSendShot';
import { useShotTimeline, type ShotTimeline } from './useShotTimeline';

const NO_MESSAGES: readonly RecipeChatMessage[] = [];
const SAVED_AND_PINNED = { isSaved: true, isPinned: true };

export interface DialInSession {
  readonly recipe: Recipe | undefined;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly error: unknown;
  readonly timeline: ShotTimeline;
  readonly messages: readonly RecipeChatMessage[];
  readonly form: ShotFormValues;
  /** Whether the two numbers a shot cannot be read without are both there. */
  readonly canSend: boolean;
  readonly isSending: boolean;
  readonly sendFailed: boolean;
  readonly isApplying: boolean;
  readonly applyFailed: boolean;
  readonly appliedMessageId: string | null;
  readonly isFinishing: boolean;
  readonly isFinished: boolean;
  readonly edit: (patch: Partial<ShotFormValues>) => void;
  readonly send: () => void;
  readonly take: (messageId: string, patch: RecipePatch) => void;
  readonly finish: () => void;
  readonly retry: () => void;
}

/**
 * One coffee, dialled in over as few shots as possible.
 *
 * The current recipe moves as the dial-in progresses: taking a suggestion
 * creates a child rather than editing the version that was pulled, so every
 * shot in the timeline still points at the numbers it was actually made with.
 * That chain is what the next answer reads to avoid proposing a change that
 * was already tried two shots ago.
 */
export const useDialInSession = (recipeId: string | null): DialInSession => {
  const { t } = useTranslation();
  const [currentId, setCurrentId] = useState<string | null>(null);
  const activeId = currentId ?? recipeId;
  const query = useRecipe(activeId);
  const recipe = query.data;
  const messages = useRecipeMessages(activeId);
  const timeline = useShotTimeline(recipe);
  const shot = useSendShot();
  const createRecipe = useCreateRecipe();
  const updateRecipe = useUpdateRecipe();

  const [form, setForm] = useState<ShotFormValues>(EMPTY_SHOT_FORM);
  const [appliedMessageId, setAppliedMessageId] = useState<string | null>(null);

  return {
    recipe,
    timeline,
    form,
    appliedMessageId,
    messages: messages.data?.items ?? NO_MESSAGES,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    canSend: toEspressoShot(form) !== null,
    isSending: shot.isPending,
    sendFailed: shot.isError,
    isApplying: createRecipe.isPending,
    applyFailed: createRecipe.isError,
    isFinishing: updateRecipe.isPending,
    isFinished: recipe?.isPinned === true,

    edit: (patch: Partial<ShotFormValues>): void => {
      setForm({ ...form, ...patch });
    },

    /**
     * The sentence is written by the app rather than by the server, because
     * every user-visible string in Brewmate comes out of the translations -
     * and because somebody who typed nothing about the taste still said
     * something worth recording: the numbers.
     */
    send: (): void => {
      const values = toEspressoShot(form);

      if (values === null || recipe === undefined) {
        return;
      }

      shot.mutate(
        {
          recipeId: recipe.id,
          shot: values,
          message: t(TRANSLATION_KEYS.dialInMessageTemplate, {
            time: values.timeSeconds,
            yield: values.yieldGrams,
            taste: form.taste.trim() === '' ? t(TRANSLATION_KEYS.dialInNoTaste) : form.taste.trim(),
          }),
        },
        {
          onSuccess: (): void => {
            setForm({ ...EMPTY_SHOT_FORM, doseGrams: form.doseGrams });
          },
        },
      );
    },

    take: (messageId: string, patch: RecipePatch): void => {
      if (recipe === undefined) {
        return;
      }

      createRecipe.mutate(buildAdjustedRecipe(recipe, patch), {
        onSuccess: (created: Recipe): void => {
          setCurrentId(created.id);
          setAppliedMessageId(messageId);
        },
      });
    },

    /** The version that finally worked becomes the pinned one for this pair. */
    finish: (): void => {
      if (recipe === undefined) {
        return;
      }

      updateRecipe.mutate({ id: recipe.id, changes: SAVED_AND_PINNED });
    },

    retry: (): void => {
      void query.refetch();
    },
  };
};
