import {
  API_ROUTES,
  aiUsageLogSchema,
  aiUsageSummarySchema,
  listResponseSchema,
  type AiUsageLog,
  type AiUsageSummary,
  type ListFilter,
  type ListResponse,
} from '@brewmate/shared';

import { getApiClient, withQuery } from '../../../lib/apiClient';

/**
 * What this account has cost in model calls.
 *
 * Read-only: the rows are written by the server services that make the calls,
 * because a client that could declare its own token usage would be reporting
 * a number nobody can trust.
 */
export const fetchAiUsage = async (filter?: ListFilter): Promise<ListResponse<AiUsageLog>> =>
  getApiClient().request({
    path: withQuery(API_ROUTES.aiUsage, filter),
    schema: listResponseSchema(aiUsageLogSchema),
  });

/**
 * The cost dashboard, added up by the API rather than by the app.
 *
 * One endpoint rather than summing the page the app happens to hold: a total
 * computed from a page would disagree with the ceiling the API enforces the
 * moment somebody scrolled, and a limit screen that argues with the limit is
 * worse than no screen.
 */
export const fetchAiUsageSummary = async (): Promise<AiUsageSummary> =>
  getApiClient().request({
    path: API_ROUTES.aiUsageSummary,
    schema: aiUsageSummarySchema,
  });
