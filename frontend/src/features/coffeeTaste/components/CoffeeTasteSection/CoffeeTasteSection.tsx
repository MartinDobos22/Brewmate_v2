import type { CoffeeLabelFacts, ParsedBagData } from '@brewmate/shared';
import type { JSX } from 'react';

import { useCoffeeTasteEstimate } from '../../hooks/useCoffeeTasteEstimate';
import { CoffeeTasteCard } from '../CoffeeTasteCard';

export interface CoffeeTasteSectionProps {
  readonly coffee: ParsedBagData & CoffeeLabelFacts;
}

/**
 * The estimate, wherever a coffee is on screen.
 *
 * A component rather than a hook call at each site, so that a screen showing a
 * coffee gains the estimate in one line and cannot accidentally show the shape
 * without the sentence that says what it rests on. Both places this appears -
 * the shelf and the cupboard - are showing the same coffee and get the same
 * answer, because the query is keyed by the label rather than by the bag.
 */
export const CoffeeTasteSection = ({ coffee }: CoffeeTasteSectionProps): JSX.Element => {
  const readout = useCoffeeTasteEstimate(coffee);

  return (
    <CoffeeTasteCard
      estimate={readout.estimate}
      summary={readout.summary}
      flavourNotes={readout.flavourNotes}
      isRefining={readout.isRefining}
    />
  );
};
