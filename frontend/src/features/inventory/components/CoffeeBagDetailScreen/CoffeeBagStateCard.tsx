import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';

import { Card } from '../../../../components/ui';
import { BagFreshnessStatus, BagRemainingBar } from '../CoffeeBagCard';

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
 *
 * The state is the sentence rather than the dial. The cupboard draws the ring
 * because it is read as a shelf at a glance; here there is one coffee and all
 * the room in the world to say what is true of it in words.
 */
export const CoffeeBagStateCard = ({ bag }: CoffeeBagStateCardProps): JSX.Element => (
  <Card variant="container">
    <BagRemainingBar bag={bag} />
    <BagFreshnessStatus bag={bag} />
  </Card>
);
