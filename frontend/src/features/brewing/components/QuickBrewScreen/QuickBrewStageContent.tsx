import type { JSX } from 'react';

import { QUICK_BREW_STAGES } from '../../constants/quickBrew';
import type { QuickBrew } from '../../hooks/useQuickBrew';
import { QuickBrewCoffeeStep } from '../QuickBrewCoffeeStep';
import { QuickBrewMethodStep } from '../QuickBrewMethodStep';
import { QuickBrewRecipeStep } from '../QuickBrewRecipeStep';

import { QuickBrewSavedStep } from './QuickBrewSavedStep';

export interface QuickBrewStageContentProps {
  readonly brew: QuickBrew;
}

/** One stage of the flow at a time, chosen where the stage is named. */
export const QuickBrewStageContent = ({ brew }: QuickBrewStageContentProps): JSX.Element => {
  if (brew.stage === QUICK_BREW_STAGES.method) {
    return <QuickBrewMethodStep brew={brew} />;
  }

  if (brew.stage === QUICK_BREW_STAGES.coffee) {
    return <QuickBrewCoffeeStep brew={brew} />;
  }

  if (brew.stage === QUICK_BREW_STAGES.recipe) {
    return <QuickBrewRecipeStep brew={brew} />;
  }

  return <QuickBrewSavedStep />;
};
