import type { CreateAnalyticsEventsRequest, CreateAnalyticsEventsResponse } from '@brewmate/shared';

import type { NewAnalyticsEventRow } from '../../db/schema/analyticsEventsTable.js';

import type { AnalyticsRepository } from './analyticsRepository.js';

const NO_PROPERTIES = {};

export interface AnalyticsService {
  record(
    userId: string,
    input: CreateAnalyticsEventsRequest,
  ): Promise<CreateAnalyticsEventsResponse>;
}

/**
 * Where the funnel is written down.
 *
 * Deliberately thin, and deliberately not clever. There is no deduplication,
 * no sessionisation and no derived "step 3 of 5" here: what is stored is what
 * a phone said happened, and every question anybody asks of it later is a
 * query over these rows. A pipeline that pre-computed a funnel would have to
 * be right about the question before anybody had asked it.
 *
 * The whole batch is written or none of it is - one statement, one round trip -
 * because the client's queue drops what it sees accepted, and a partial write
 * it was told nothing about is a hole in the history nobody can find.
 */
export const createAnalyticsService = (repository: AnalyticsRepository): AnalyticsService => ({
  record: async (userId, { events }): Promise<CreateAnalyticsEventsResponse> => ({
    accepted: await repository.recordAll(
      events.map((event): NewAnalyticsEventRow => ({
        userId,
        name: event.name,
        properties: event.properties ?? NO_PROPERTIES,
        /**
         * The phone's clock, kept as the phone reported it. These are queued
         * while offline and flushed later; stamping them on arrival would
         * report a morning's brewing as having happened all at once that
         * evening. The row's own `created_at` records when they arrived, so
         * a wrong device clock is visible rather than invisible.
         */
        occurredAt: new Date(event.occurredAt),
      })),
    ),
  }),
});
