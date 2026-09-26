import type { BrewMethod, CoffeeBag, Recipe } from '@brewmate/shared';

import { useRecipes } from '../../brewing/hooks';
import { useCoffeeBags } from '../../inventory/hooks';
import { useBrewMethodCatalog } from '../../inventory/hooks';
import { HOME_SUGGESTION } from '../constants/homeTiles';
import { resolveSuggestedBag, type SuggestedBag } from '../services/resolveSuggestedBag';

const NO_BAGS: readonly CoffeeBag[] = [];
const FIRST = 0;

export interface HomeSuggestion {
  /** The bag to open this morning, with the band that put it at the top. */
  readonly suggested: SuggestedBag | null;
  /**
   * What this coffee has already been brewed as, where there is anything.
   *
   * Null is an ordinary state rather than a gap: a bag written down this
   * morning has no recipe yet, and the block then offers to write one instead
   * of printing numbers nothing stands behind.
   */
  readonly recipe: Recipe | null;
  readonly method: BrewMethod | null;
  /** False while anything behind the block is still loading. */
  readonly isReady: boolean;
}

/**
 * What the home screen offers to brew, and what it can prove about it.
 *
 * The recipe is read rather than written: a screen that asked the engine for
 * one every time it opened would spend a model call on every launch, and hand
 * back numbers slightly different from the ones somebody had settled on. The
 * API returns pinned recipes first, so the first row is the version that was
 * dialled in where there is one and the newest where there is not - the same
 * rule the screen before a brew already follows.
 */
export const useHomeSuggestion = (): HomeSuggestion => {
  const bags = useCoffeeBags();
  const suggested = resolveSuggestedBag(bags.data?.items ?? NO_BAGS);
  const recipes = useRecipes(
    suggested === null ? undefined : { bagId: suggested.bag.id, limit: HOME_SUGGESTION.recipePage },
    suggested !== null,
  );
  const { methods } = useBrewMethodCatalog();

  const recipe = recipes.data?.items[FIRST] ?? null;
  const method =
    recipe === null
      ? null
      : (methods.find((item: BrewMethod): boolean => item.id === recipe.methodId) ?? null);

  return {
    suggested,
    recipe,
    method,
    isReady: bags.isSuccess && (suggested === null || recipes.isSuccess),
  };
};
