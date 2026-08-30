import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';

import { groupBagsByFreshness, type BagGroup } from '../../services';

import { CoffeeBagGroup } from './CoffeeBagGroup';

export interface CoffeeBagGroupsProps {
  readonly bags: readonly CoffeeBag[];
}

/**
 * The cupboard, in the order somebody standing in front of it reads it.
 *
 * Grouped by what to do with each bag this morning rather than by when it was
 * added: ready now, then what will be lost if it keeps waiting, then what is
 * still fine, then what is not ready yet, then what carries no date to judge
 * by. Newest-first answered a question nobody asks at a shelf, and it buried
 * the one bag actually worth opening under two that were still resting.
 */
export const CoffeeBagGroups = ({ bags }: CoffeeBagGroupsProps): JSX.Element => (
  <>
    {groupBagsByFreshness(bags).map((group: BagGroup): JSX.Element => (
      <CoffeeBagGroup key={group.freshness} group={group} />
    ))}
  </>
);
