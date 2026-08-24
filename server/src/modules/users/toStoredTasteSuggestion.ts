import type { StoredTasteSuggestion } from '@brewmate/shared';

import type { InsightSuggestionRow } from '../../db/schema/insightSuggestionsTable.js';

/**
 * Converts a stored suggestion into the shape the export declares.
 *
 * It lives here rather than in the insights module because the export is the
 * only thing that ever reads these rows as rows - the insights service works
 * with the evidence and treats the table as a record of what was answered.
 */
export const toStoredTasteSuggestion = (row: InsightSuggestionRow): StoredTasteSuggestion => ({
  id: row.id,
  userId: row.userId,
  ref: row.suggestionRef,
  explanation: row.explanation,
  dismissedAt: row.dismissedAt?.toISOString() ?? null,
  acceptedAt: row.acceptedAt?.toISOString() ?? null,
  createdAt: row.createdAt.toISOString(),
});
