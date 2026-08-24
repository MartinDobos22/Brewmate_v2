import type { Recipe } from '@brewmate/shared';
import type { JSX } from 'react';

import { Screen } from '../../../../components/layout';
import { QueryState } from '../../../../components/ui';
import { useRecipes } from '../../../brewing/hooks';
import { useCoffeeBag } from '../../hooks';

import { BagRecipeHistory } from './BagRecipeHistory';
import { CoffeeBagInfoCard } from './CoffeeBagInfoCard';

const NO_RECIPES: readonly Recipe[] = [];

export interface CoffeeBagDetailScreenProps {
  readonly bagId: string;
}

/**
 * One coffee, and everything that was ever made from it.
 *
 * The recipes are fetched for this bag specifically rather than filtered out of
 * the whole list: a cupboard somebody has been keeping for a year is a lot of
 * recipes, and only this bag's are ever shown here.
 */
export const CoffeeBagDetailScreen = ({ bagId }: CoffeeBagDetailScreenProps): JSX.Element => {
  const bag = useCoffeeBag(bagId);
  const recipes = useRecipes({ bagId });

  return (
    <Screen scrollable>
      <QueryState
        isPending={bag.isPending}
        isError={bag.isError}
        error={bag.error}
        onRetry={(): void => {
          void bag.refetch();
        }}
      />
      {bag.data === undefined ? null : (
        <>
          <CoffeeBagInfoCard bag={bag.data} />
          <BagRecipeHistory recipes={recipes.data?.items ?? NO_RECIPES} bagId={bag.data.id} />
        </>
      )}
    </Screen>
  );
};
