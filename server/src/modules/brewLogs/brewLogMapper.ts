import type { BrewLog } from '@brewmate/shared';

import type { BrewLogRow } from '../../db/schema/brewLogsTable.js';

/** Converts a database row into the shape declared by the shared contract. */
export const toBrewLog = (row: BrewLogRow): BrewLog => ({
  id: row.id,
  userId: row.userId,
  recipeId: row.recipeId,
  bagId: row.bagId,
  equipmentSetId: row.equipmentSetId,
  constraints: row.constraints,
  actualParams: row.actualParams,
  waterType: row.waterType,
  durationSeconds: row.durationSeconds,
  profileLearningWeight: row.profileLearningWeight,
  createdAt: row.createdAt.toISOString(),
});
