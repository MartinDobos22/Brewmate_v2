import type { TasteAxes } from '@brewmate/shared';

import { TASTE_AXIS_ORDER, type TasteAxisName } from '../constants/tasteAxes';

export interface TasteAxisValue {
  readonly axis: TasteAxisName;
  readonly value: number;
}

/**
 * The five axes in their fixed order, ready to be drawn or edited.
 *
 * Takes anything carrying the axes - the stored profile, or a draft being
 * dragged around by the sliders - so the chart and the editor read the same
 * function.
 */
export const readTasteAxes = (axes: TasteAxes): readonly TasteAxisValue[] =>
  TASTE_AXIS_ORDER.map((axis: TasteAxisName): TasteAxisValue => ({ axis, value: axes[axis] }));
