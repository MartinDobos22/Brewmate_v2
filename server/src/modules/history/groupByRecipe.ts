import type { RecipeRowCount } from './historyRepository.js';

/** Anything read for a timeline that knows which version it belongs to. */
interface RecipeScoped {
  readonly recipeId: string;
}

/**
 * Buckets rows by the version they belong to.
 *
 * One pass rather than a filter per version, because a timeline with forty
 * versions and eight hundred rows would otherwise walk the list forty times to
 * answer a question one walk already answers.
 */
export const groupByRecipe = <TRow extends RecipeScoped>(
  rows: readonly TRow[],
): ReadonlyMap<string, readonly TRow[]> => {
  const grouped = new Map<string, TRow[]>();

  for (const row of rows) {
    const bucket = grouped.get(row.recipeId);

    if (bucket === undefined) {
      grouped.set(row.recipeId, [row]);
    } else {
      bucket.push(row);
    }
  }

  return grouped;
};

/** The true totals, which the capped lists above deliberately do not carry. */
export const toCountByRecipe = (counts: readonly RecipeRowCount[]): ReadonlyMap<string, number> =>
  new Map(
    counts.map((row: RecipeRowCount): readonly [string, number] => [row.recipeId, row.total]),
  );
