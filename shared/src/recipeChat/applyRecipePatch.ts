import type { BrewParams } from '../brewing/brewParamsSchema.js';

import type { RecipePatch } from './recipePatchSchema.js';

/**
 * The recipe as it would be if the proposal were taken.
 *
 * In the contract rather than in the app, because two places need exactly the
 * same answer: the screen drawing the old-to-new diff, and the write that
 * creates the adjusted version a tap later. If those two differed at all, the
 * numbers somebody agreed to and the numbers they got would not be the same
 * numbers - which is the one mistake this whole exchange exists to avoid.
 *
 * A field the patch does not mention is a field that stays as it is. That is
 * what makes a patch readable as a diff: everything on it is a change, and
 * nothing that is not on it moved.
 */
export const applyRecipePatch = (params: BrewParams, patch: RecipePatch): BrewParams => ({
  ...params,
  ...patch.params,
});
