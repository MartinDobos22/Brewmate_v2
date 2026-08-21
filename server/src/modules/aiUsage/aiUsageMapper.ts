import type { AiUsageLog } from '@brewmate/shared';

import type { AiUsageLogRow } from '../../db/schema/aiUsageLogsTable.js';

/** Converts a database row into the shape declared by the shared contract. */
export const toAiUsageLog = (row: AiUsageLogRow): AiUsageLog => ({
  id: row.id,
  userId: row.userId,
  functionName: row.functionName,
  model: row.model,
  tokensIn: row.tokensIn,
  tokensOut: row.tokensOut,
  costEstimate: row.costEstimate,
  createdAt: row.createdAt.toISOString(),
});
