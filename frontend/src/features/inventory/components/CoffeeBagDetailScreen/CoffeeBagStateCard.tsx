import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';

import { Card } from '../../../../components/ui';
import { BagFreshnessLabel, BagRemainingBar } from '../CoffeeBagCard';

export interface CoffeeBagStateCardProps {
  readonly bag: CoffeeBag;
}

/**
 * The two facts that decide whether this is the coffee for this morning.
 *
 * The same pair the cupboard prints on every card, drawn the same way - how
 * much is left, and whether it is ready. They used to be one small metadata
 * row wedged between the coffee's name and ten rows of reference data, at the
 * same weight as its altitude.
 */
export const CoffeeBagStateCard = ({ bag }: CoffeeBagStateCardProps): JSX.Element => (
  <Card variant="container">
    <BagRemainingBar bag={bag} />
    <BagFreshnessLabel bag={bag} />
  </Card>
);
