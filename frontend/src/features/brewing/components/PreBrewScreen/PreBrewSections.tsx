import type { JSX } from 'react';

import { ConfidenceNotice } from '../../../tasteProfile/components';
import { WaterTypePicker } from '../../../inventory/components';
import type { BrewSetup } from '../../hooks/useBrewSetup';
import { BrewConstraintsSection } from '../BrewConstraintsSection';
import { PreBrewAmountsSection } from '../PreBrewAmountsSection';
import { PreBrewCoffeeSection } from '../PreBrewCoffeeSection';
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
        <BrewConstraintsSection
          constraints={setup.constraints}
          fromSet={setup.activeSet !== undefined}
          onToggle={setup.toggleConstraint}
        />
        <WaterTypePicker selected={setup.waterType} onSelect={setup.chooseWater} />
        <PreBrewAmountsSection control={setup} method={setup.method} warnings={setup.warnings} />
        <ConfidenceNotice />
      </>
    )}
  </>
);
