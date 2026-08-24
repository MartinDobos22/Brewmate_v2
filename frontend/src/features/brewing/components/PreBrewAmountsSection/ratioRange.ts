import type { BrewMethod } from '@brewmate/shared';

import type { StepRange } from '../../../../components/ui';
import { BREW_RATIO } from '../../../../constants/brewing';

/**
 * How far outside the method's usual window the slider still reaches.
 *
 * Two parts of water either side. Somebody who wants a cup outside what the
 * catalogue calls usual is allowed to have one - a slider that stops at the
 * edge of somebody else's opinion is a slider that argues with the person
 * holding the kettle - and two parts is enough room to be deliberate without
 * making the useful part of the track hard to hit.
 */
export const RATIO_RANGE_PADDING = 2;

/** The method's window, widened, and never outside what the schema accepts. */
export const clampRatioRange = (
  method: BrewMethod,
  min: number,
  max: number,
  padding: number,
): StepRange => ({
  min: Math.max(method.defaultRatioRange.min - padding, min),
  max: Math.min(method.defaultRatioRange.max + padding, max),
  step: BREW_RATIO.step,
});
