import type { CoffeeLabelFacts, ParsedBagData } from '@brewmate/shared';
import type { JSX } from 'react';

import { useTasteProfile } from '../../../tasteProfile/hooks';
import { useCoffeeMatch } from '../../hooks/useCoffeeMatch';
import { useCoffeeTasteEstimate } from '../../hooks/useCoffeeTasteEstimate';
import { CoffeeMatchCard } from '../CoffeeMatchCard';
import { CoffeeTasteCard } from '../CoffeeTasteCard';

export interface CoffeeTasteSectionProps {
  readonly coffee: ParsedBagData & CoffeeLabelFacts;
}

/**
 * What this coffee tastes like, and what that means for you.
 *
 * Two cards rather than one, because they answer different questions and one
 * of them is true for everybody. What is in the bag is a fact about a product
 * on a shelf; whether it suits you is a fact about you, and it disappears
 * entirely for an account nobody has measured yet. Merging them would make the
 * first one vanish along with the second.
 *
 * On the shelf this sits under a verdict that has already said how the coffee
 * fits, in prose. That is not a repetition: the sentence is what somebody
 * wants first and the picture is what they open when they want to disagree
 * with it - the same reason the verdict's own reasoning is folded away behind
 * one tap rather than left off.
 */
export const CoffeeTasteSection = ({ coffee }: CoffeeTasteSectionProps): JSX.Element => {
  const readout = useCoffeeTasteEstimate(coffee);
  const profile = useTasteProfile();
  const match = useCoffeeMatch(readout.estimate);

  return (
    <>
      <CoffeeTasteCard
        estimate={readout.estimate}
        summary={readout.summary}
        flavourNotes={readout.flavourNotes}
        isRefining={readout.isRefining}
      />
      {match !== null && profile.data !== undefined ? (
        <CoffeeMatchCard match={match} profile={profile.data} />
      ) : null}
    </>
  );
};
