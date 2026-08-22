import type { BagEvaluation } from '@brewmate/shared';

import type { BagEvaluationRow } from '../../db/schema/bagEvaluationsTable.js';

/** Converts a database row into the shape declared by the shared contract. */
export const toBagEvaluation = (row: BagEvaluationRow): BagEvaluation => ({
  id: row.id,
  userId: row.userId,
  imageUrl: row.imageUrl,
  parsedData: row.parsedData,
  verdictText: row.verdictText,
  reasoning: row.reasoning,
  uncertainties: row.uncertainties,
  profileConfidenceAtTime: row.profileConfidenceAtTime,
  wasPurchased: row.wasPurchased,
  linkedBagId: row.linkedBagId,
  createdAt: row.createdAt.toISOString(),
});
