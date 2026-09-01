import type { TasteProfile, TasteProfileEvent } from '@brewmate/shared';

import type { TasteProfileEventRow } from '../../db/schema/tasteProfileEventsTable.js';
import type { TasteProfileRow } from '../../db/schema/tasteProfilesTable.js';

/** Converts a database row into the shape declared by the shared contract. */
export const toTasteProfile = (row: TasteProfileRow): TasteProfile => ({
  userId: row.userId,
  acidity: row.acidity,
  sweetness: row.sweetness,
  body: row.body,
  bitterness: row.bitterness,
  intensity: row.intensity,
  flavorAffinities: row.flavorAffinities,
  roastPreference: row.roastPreference,
  milkUsage: row.milkUsage,
  sourceWeights: row.sourceWeights,
  axisConfidence: row.axisConfidence,
  confidenceLevel: row.confidenceLevel,
  brewCount: row.brewCount,
  updatedAt: row.updatedAt.toISOString(),
});

/** Converts an audit row into the shape declared by the shared contract. */
export const toTasteProfileEvent = (row: TasteProfileEventRow): TasteProfileEvent => ({
  id: row.id,
  userId: row.userId,
  source: row.source,
  sourceRef: row.sourceRef,
  payload: row.payload,
  appliedDelta: row.appliedDelta ?? null,
  createdAt: row.createdAt.toISOString(),
});
