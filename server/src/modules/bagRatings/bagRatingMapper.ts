import type { BagRating } from '@brewmate/shared';

import type { BagRatingRow } from '../../db/schema/bagRatingsTable.js';

/** Converts a database row into the shape declared by the shared contract. */
export const toBagRating = (row: BagRatingRow): BagRating => ({
  id: row.id,
  bagId: row.bagId,
  stage: row.stage,
  stars: row.stars,
  impression: row.impression,
  tags: row.tags,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
});
