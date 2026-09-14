import type { BrewLog, BrewMethod, CoffeeBag, Recipe, RecipeTimelineEntry } from '@brewmate/shared';

import { useRecipeTimeline } from '../../history/hooks';

const NO_ENTRIES: readonly RecipeTimelineEntry[] = [];
const NO_CUPS = 0;
const LATEST_CUP = 0;
const NEWEST_VERSION = -1;

export interface PreviousBrew {
  /** The recipe worth offering again, or null where this pair is new. */
  readonly recipe: Recipe | null;
  /** Whether it is the one they pinned for this pair, rather than merely the latest. */
  readonly isPinned: boolean;
  /** Every cup ever made on this line, across all of its versions. */
  readonly brewCount: number;
  /** When the most recent of those cups was made, where there has been one. */
  readonly lastBrewedAt: string | null;
  readonly isLoading: boolean;
}

/**
 * The most recent cup on the line, wherever on it it was made.
 *
 * Usually the newest version's, and deliberately not assumed to be: somebody
 * who went back to an older version because the adjustment was a mistake made
 * their last cup from a recipe in the middle of the list. The timestamps are
 * UTC instants in one format, so the greatest string is the latest moment.
 */
const latestCup = (entries: readonly RecipeTimelineEntry[]): string | null =>
  entries.reduce((latest: string | null, entry: RecipeTimelineEntry): string | null => {
    const cup: BrewLog | undefined = entry.brews[LATEST_CUP];

    if (cup === undefined) {
      return latest;
    }

    return latest === null || cup.createdAt > latest ? cup.createdAt : latest;
  }, null);

/**
 * What this person has already brewed for this coffee in this brewer.
 *
 * The screen before a brew used to write a new recipe every single time, which
 * on a pair somebody had already dialled in meant paying a model to rediscover
 * an answer sitting in their own rows - and handing them numbers slightly
 * different from the ones they had settled on. A recipe belongs to the pair
 * (bag, method), so that is what is asked for, through the endpoint that
 * already understands the pair: an absent bag is the quick-brew line rather
 * than "any coffee", which is the one distinction a flat recipe filter cannot
 * make and the one that would otherwise offer somebody a recipe for a
 * different bag entirely.
 *
 * The pinned version wins over the newest. Pinning is the whole point of
 * dialling something in - it is the version that finally worked - and a later
 * version exists precisely when somebody was still experimenting. Where
 * nothing is pinned the newest is the best guess, because it is what came out
 * of the last conversation about a cup.
 */
export const usePreviousBrew = (
  bag: CoffeeBag | null,
  method: BrewMethod | undefined,
): PreviousBrew => {
  const timeline = useRecipeTimeline({ methodId: method?.id, bagId: bag?.id });
  const entries = timeline.data?.entries ?? NO_ENTRIES;
  const pinned = entries.find((entry: RecipeTimelineEntry): boolean => entry.recipe.isPinned);
  const offered = pinned ?? entries.at(NEWEST_VERSION);

  return {
    recipe: offered?.recipe ?? null,
    isPinned: pinned !== undefined,
    brewCount: entries.reduce(
      (total: number, entry: RecipeTimelineEntry): number => total + entry.brewCount,
      NO_CUPS,
    ),
    lastBrewedAt: latestCup(entries),
    isLoading: timeline.isPending,
  };
};
