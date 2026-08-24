import {
  API_ROUTES,
  createAnalyticsEventsResponseSchema,
  type AnalyticsEvent,
  type CreateAnalyticsEventsResponse,
} from '@brewmate/shared';

import { HTTP_METHODS } from '../../constants/http';
import { getApiClient } from '../apiClient';

/**
 * Sends a flushed batch.
 *
 * A batch rather than a request per event, because these are sent from a phone
 * in a kitchen: one round trip when the connection comes back beats fifteen
 * that each fail on their own.
 */
export const sendAnalyticsEvents = async (
  events: readonly AnalyticsEvent[],
): Promise<CreateAnalyticsEventsResponse> =>
  getApiClient().request({
    path: API_ROUTES.analyticsEvents,
    method: HTTP_METHODS.post,
    body: { events },
    schema: createAnalyticsEventsResponseSchema,
  });
