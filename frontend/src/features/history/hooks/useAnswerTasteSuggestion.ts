import type { UseMutationResult } from '@tanstack/react-query';
import {
  ANALYTICS_EVENT_NAMES,
  type AcceptTasteSuggestionResponse,
  type DismissTasteSuggestionResponse,
} from '@brewmate/shared';

import { QUERY_ROOTS } from '../../../constants/queryKeys';
import { useInvalidatingMutation } from '../../../hooks/useEntityMutation';
import { acceptTasteSuggestion, dismissTasteSuggestion } from '../services/insightsApi';

/**
 * Agreeing with what the history says.
 *
 * Not optimistic, and it could not honestly be: accepting appends an event and
 * the server folds the whole trail again, so how far each axis actually moves
 * depends on how much evidence came before. Guessing at it would mean showing
 * a profile that is about to change - and the numbers in question are exactly
 * the ones this product exists to get right.
 */
export const useAcceptTasteSuggestion = (): UseMutationResult<
  AcceptTasteSuggestionResponse,
  Error,
  string
> =>
  useInvalidatingMutation({
    mutationFn: acceptTasteSuggestion,
    invalidates: [QUERY_ROOTS.insights, QUERY_ROOTS.tasteProfile, QUERY_ROOTS.tasteProfileEvents],
    tracks: ANALYTICS_EVENT_NAMES.insightSuggestionAccepted,
  });

/**
 * Saying no, which writes nothing about anybody's taste.
 *
 * The insights are refetched afterwards so the card leaves the screen. It
 * comes back only when the history itself has moved on, which is the point:
 * somebody who said no after six brews is entitled to be asked again after
 * thirty.
 */
export const useDismissTasteSuggestion = (): UseMutationResult<
  DismissTasteSuggestionResponse,
  Error,
  string
> =>
  useInvalidatingMutation({
    mutationFn: dismissTasteSuggestion,
    invalidates: [QUERY_ROOTS.insights],
    tracks: ANALYTICS_EVENT_NAMES.insightSuggestionDismissed,
  });
