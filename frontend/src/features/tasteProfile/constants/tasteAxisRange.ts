import { TASTE_AXIS_MAX, TASTE_AXIS_MIN } from '@brewmate/shared';

import type { StepRange } from '../../../components/ui';

/**
 * The range the manual sliders move in.
 *
 * Half-point steps rather than whole ones: the reducer blends in fractions
 * anyway, and a slider that can only land on integers would make every hand
 * correction a bigger statement than the person intended.
 */
export const TASTE_AXIS_RANGE: StepRange = {
  min: TASTE_AXIS_MIN,
  max: TASTE_AXIS_MAX,
  step: 0.5,
};
