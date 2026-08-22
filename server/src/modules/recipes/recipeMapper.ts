import type { Recipe } from '@brewmate/shared';

import type { RecipeRow } from '../../db/schema/recipesTable.js';

/** Converts a database row into the shape declared by the shared contract. */
export const toRecipe = (row: RecipeRow): Recipe => ({
  id: row.id,
  userId: row.userId,
  bagId: row.bagId,
  methodId: row.methodId,
  equipmentIds: [...row.equipmentIds],
  params: row.params,
  rationale: row.rationale,
  source: row.source,
  parentRecipeId: row.parentRecipeId,
  isSaved: row.isSaved,
  isPinned: row.isPinned,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
});
