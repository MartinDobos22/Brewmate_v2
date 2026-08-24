import {
  API_ROUTES,
  acceptTasteSuggestionResponseSchema,
  dismissTasteSuggestionResponseSchema,
  insightsResponseSchema,
  type AcceptTasteSuggestionResponse,
  type DismissTasteSuggestionResponse,
  type InsightsResponse,
} from '@brewmate/shared';

import { HTTP_METHODS } from '../../../constants/http';
import { getApiClient } from '../../../lib/apiClient';

/** What this account's brewing adds up to, and what the app proposes about it. */
export const fetchInsights = async (): Promise<InsightsResponse> =>
  getApiClient().request({ path: API_ROUTES.insights, schema: insightsResponseSchema });

/**
 * Both answers name the evidence, never the conclusion.
 *
 * `ref` fingerprints the counts the proposal was drawn from, which is what
 * makes agreeing twice count once and makes a refusal last exactly as long as
 * the history it was about.
 */
export const acceptTasteSuggestion = async (ref: string): Promise<AcceptTasteSuggestionResponse> =>
  getApiClient().request({
    path: API_ROUTES.insightSuggestionAccept,
    method: HTTP_METHODS.post,
    body: { ref },
    schema: acceptTasteSuggestionResponseSchema,
  });

export const dismissTasteSuggestion = async (
  ref: string,
): Promise<DismissTasteSuggestionResponse> =>
  getApiClient().request({
    path: API_ROUTES.insightSuggestionDismiss,
    method: HTTP_METHODS.post,
    body: { ref },
    schema: dismissTasteSuggestionResponseSchema,
  });
