import {
  ANALYTICS_EVENT_NAMES,
  ANALYTICS_EVENT_NAME_VALUES,
  type AnalyticsEventName,
  type StoredAnalyticsEvent,
} from '@brewmate/shared';

import type { AnalyticsEventRow } from '../../db/schema/analyticsEventsTable.js';

const FALLBACK_NAME = ANALYTICS_EVENT_NAMES.onboardingStarted;

const isKnownName = (name: string): name is AnalyticsEventName =>
  ANALYTICS_EVENT_NAME_VALUES.some((known: AnalyticsEventName): boolean => known === name);

/**
 * Converts a stored row into the shape the contract declares.
 *
 * The column is text while the contract is a closed set, and that difference
 * is deliberate: the list of interesting flows changes faster than a schema
 * should, and retiring a name must not orphan the history behind it. A row
 * whose name the current contract no longer knows is therefore possible, and
 * it is reported under a name the schema accepts rather than crashing an
 * export - an export that fails because of one retired event name is an export
 * somebody cannot get.
 */
export const toStoredAnalyticsEvent = (row: AnalyticsEventRow): StoredAnalyticsEvent => ({
  id: row.id,
  userId: row.userId,
  name: isKnownName(row.name) ? row.name : FALLBACK_NAME,
  properties: row.properties,
  occurredAt: row.occurredAt.toISOString(),
  createdAt: row.createdAt.toISOString(),
});
