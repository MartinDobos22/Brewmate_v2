import {
  resolveShotTimeline,
  type BrewLog,
  type Recipe,
  type ShotSource,
  type ShotTimelineEntry,
} from '@brewmate/shared';

import { useBrewLogs, useRecipes } from '../../brewing/hooks';

const NO_LOGS: readonly BrewLog[] = [];
const NO_RECIPES: readonly Recipe[] = [];

export interface ShotTimeline {
  readonly entries: readonly ShotTimelineEntry[];
  readonly isLoading: boolean;
}

/**
 * The run of shots behind a dial-in, oldest first.
 *
 * Read back from the rows rather than accumulated on screen, so a dial-in
 * survives the app being closed between shots - which it will be, because the
 * gaps between shots are spent grinding and tamping.
 *
 * The recipes are fetched for the pair (bag, method) rather than walked up the
 * parent chain one request at a time: the chain of adjustments for one coffee
 * on one machine is exactly that pair, and one query beats five.
 */
export const useShotTimeline = (recipe: Recipe | undefined): ShotTimeline => {
  const recipes = useRecipes(
    recipe === undefined
      ? undefined
      : { bagId: recipe.bagId ?? undefined, methodId: recipe.methodId },
  );
  const logs = useBrewLogs(recipe === undefined ? undefined : { bagId: recipe.bagId ?? undefined });

  const versions = recipes.data?.items ?? NO_RECIPES;
  const grindByRecipeId = new Map<string, number | null>(
    versions.map((version: Recipe): readonly [string, number | null] => [
      version.id,
      version.params.grindSetting,
    ]),
  );

  /**
   * Only the shots pulled from this dial-in's own recipes. The same bag
   * brewed on a different machine last month is a different exercise, and its
   * shots would push this morning's run out of the picture.
   */
  const shots: readonly ShotSource[] = (logs.data?.items ?? NO_LOGS)
    .filter((log: BrewLog): boolean => grindByRecipeId.has(log.recipeId))
    .map((log: BrewLog): ShotSource => ({
      log,
      grindSetting: grindByRecipeId.get(log.recipeId) ?? null,
    }))
    /*
     * Sorted over a copy rather than through `toSorted`: Hermes does not ship
     * every ES2023 array method, and the one thing this screen cannot afford
     * is the run of shots coming out in the wrong order on a device.
     */
    .slice()
    .sort((left: ShotSource, right: ShotSource): number =>
      left.log.createdAt.localeCompare(right.log.createdAt),
    );

  return {
    entries: resolveShotTimeline(shots),
    isLoading: recipes.isPending || logs.isPending,
  };
};
