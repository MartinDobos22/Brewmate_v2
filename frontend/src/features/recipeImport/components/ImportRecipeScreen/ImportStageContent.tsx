import type { JSX } from 'react';

import { IMPORT_STAGES } from '../../constants';
import type { RecipeImport } from '../../hooks';
import { ImportReviewStep } from '../ImportReviewStep';
import { ImportSourceStep } from '../ImportSourceStep';
import { ImportTargetStep } from '../ImportTargetStep';

import { ImportResultStep } from './ImportResultStep';

export interface ImportStageContentProps {
  readonly recipeImport: RecipeImport;
}

/**
 * Which of the four stages is on screen.
 *
 * Split out of the screen itself so that adding a stage is one branch in one
 * small file rather than a screen component that has quietly become a router.
 */
export const ImportStageContent = ({ recipeImport }: ImportStageContentProps): JSX.Element => {
  if (recipeImport.stage === IMPORT_STAGES.source) {
    return <ImportSourceStep recipeImport={recipeImport} />;
  }

  if (recipeImport.stage === IMPORT_STAGES.review) {
    return <ImportReviewStep recipeImport={recipeImport} />;
  }

  if (recipeImport.stage === IMPORT_STAGES.target) {
    return <ImportTargetStep recipeImport={recipeImport} />;
  }

  return <ImportResultStep recipeImport={recipeImport} />;
};
