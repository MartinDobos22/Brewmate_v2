import {
  API_ROUTES,
  aiUsageLogSchema,
  listResponseSchema,
  type AiUsageLog,
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
