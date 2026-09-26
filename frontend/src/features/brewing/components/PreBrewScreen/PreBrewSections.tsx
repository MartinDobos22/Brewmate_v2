import type { JSX } from 'react';

import { ConfidenceNotice } from '../../../tasteProfile/components';
import type { BrewSetup } from '../../hooks/brewSetup';
import { BrewConstraintsSection } from '../BrewConstraintsSection';
import { PreBrewPreviousRecipe } from '../PreBrewPreviousRecipe';
import { PreBrewAmountsSection } from '../PreBrewAmountsSection';
import { PreBrewGrindSection } from '../PreBrewGrindSection';
import { PreBrewMethodSection } from '../PreBrewMethodSection';
import { PreBrewWaterSection } from '../PreBrewWaterSection';

export interface PreBrewSectionsProps {
  readonly setup: BrewSetup;
}

/**
 * The questions, in order.
 *
 * The coffee is not among them any more: it is reported in the header, which
 * is where the screen leads with it. Asking it twice is how two places end up
 * setting one value and eventually disagreeing about it.
 *
 * The two that depend on a method - what is missing, and how much of each -
 * appear only once one is chosen. Asking somebody for a dose before they have
 * said what they are brewing in is asking them to guess at a number the next
 * answer is about to change.
 *
 * The recipe they already have for this pair comes first of those, above every
 * question it has already answered. It is an offer rather than a default -
 * writing a new one is still the button at the bottom - but an offer made
 * after somebody has set a dose, a ratio and a grind is one that saved them
 * nothing.
 */
export const PreBrewSections = ({ setup }: PreBrewSectionsProps): JSX.Element => (
  <>
    <PreBrewMethodSection
      methods={setup.methods}
      brewers={setup.brewers}
      method={setup.method}
      onChoose={setup.chooseMethod}
    />
    {setup.method === undefined ? null : (
      <>
        <PreBrewPreviousRecipe
          bag={setup.bag}
          method={setup.method}
          equipmentSetId={setup.activeSet?.id}
        />
        <BrewConstraintsSection
          constraints={setup.constraints}
          fromSet={setup.activeSet !== undefined}
          onToggle={setup.toggleConstraint}
        />
        <PreBrewWaterSection waterType={setup.waterType} onChoose={setup.chooseWater} />
        <PreBrewAmountsSection control={setup} method={setup.method} warnings={setup.warnings} />
        <PreBrewGrindSection
          method={setup.method}
          bag={setup.bag}
          equipmentSet={setup.activeSet}
          grinderEquipmentId={setup.grinderEquipmentId}
          onChooseGrinder={setup.chooseGrinder}
        />
        <ConfidenceNotice />
      </>
    )}
  </>
);
