import type { CoffeeBag } from '@brewmate/shared';

import { useCoffeeBags } from '../../inventory/hooks';
import { summariseInventory, type InventorySummary } from '../../inventory/services';

const NO_BAGS: readonly CoffeeBag[] = [];

export interface InventoryOverview extends InventorySummary {
  /** False while the cupboard is still loading, so no tile prints a wrong zero. */
  readonly isReady: boolean;
}

/**
 * What the cupboard looks like from the home screen.
 *
 * The whole page rather than a single row: this is the one place that needs
 * the bags themselves - how much is left across all of them, and which one is
 * resting, ready or going off - and every one of those is a fact about the
 * collection rather than about its size.
 *
 * The same unfiltered page the cupboard screen itself reads, so the tile and
 * the screen it leads to are counting the same bags. A tile that summarised a
 * different slice would be a number somebody could catch disagreeing with the
 * list one tap away.
 */
export const useInventorySummary = (): InventoryOverview => {
  const bags = useCoffeeBags();

  return {
    ...summariseInventory(bags.data?.items ?? NO_BAGS),
    isReady: bags.isSuccess,
  };
};
