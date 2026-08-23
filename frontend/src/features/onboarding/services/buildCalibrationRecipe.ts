import { RECIPE_SOURCES, type BrewParams, type CreateRecipeRequest } from '@brewmate/shared';

import { buildReferenceParams, type ReferenceRecipeInput } from '../../brewing/services';

/** What the calibration step knows; the roast is not one of those things. */
export type CalibrationInput = Omit<ReferenceRecipeInput, 'roastLevel'>;

const NO_ROAST_DECLARED = null;

/**
 * The reference cup.
 *
 * The same builder every proposed recipe goes through, with the roast left
 * undeclared: at this point in the flow nobody has told Brewmate what they are
 * about to brew, and the whole value of a calibration cup is that its recipe
 * is the plain one.
 */
export const buildCalibrationParams = (input: CalibrationInput): BrewParams =>
  buildReferenceParams({ ...input, roastLevel: NO_ROAST_DECLARED });

/** The same cup, as the API takes it. */
export const buildCalibrationRecipe = (
  input: CalibrationInput,
  rationale: string,
): CreateRecipeRequest => ({
  methodId: input.method.id,
  equipmentIds: input.brewer === undefined ? [] : [input.brewer.id],
  params: buildCalibrationParams(input),
  rationale,
  source: RECIPE_SOURCES.calibration,
});
