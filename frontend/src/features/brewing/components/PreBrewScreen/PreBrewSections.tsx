import type { JSX } from 'react';

import { ConfidenceNotice } from '../../../tasteProfile/components';
import { WaterTypePicker } from '../../../inventory/components';
import type { BrewSetup } from '../../hooks/useBrewSetup';
import { BrewConstraintsSection } from '../BrewConstraintsSection';
import { PreBrewPreviousRecipe } from '../PreBrewPreviousRecipe';
import { PreBrewAmountsSection } from '../PreBrewAmountsSection';
import { PreBrewCoffeeSection } from '../PreBrewCoffeeSection';
import { PreBrewGrindSection } from '../PreBrewGrindSection';
import { PreBrewMethodSection } from '../PreBrewMethodSection';

export interface PreBrewSectionsProps {
  readonly setup: BrewSetup;
}

/**
 * The questions, in order.
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
    <PreBrewCoffeeSection
      bag={setup.bag}
      description={setup.coffeeDescription}
      onDescribe={setup.describeCoffee}
      onChange={setup.changeCoffee}
    />
    <PreBrewMethodSection
      methods={setup.methods}
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
        <WaterTypePicker selected={setup.waterType} onSelect={setup.chooseWater} />
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
