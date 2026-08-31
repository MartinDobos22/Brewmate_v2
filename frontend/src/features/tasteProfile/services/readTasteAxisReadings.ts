import {
  TASTE_AXIS_MAX,
  isAxisKnown,
  resolveTasteAxisBand,
  type TasteAxes,
  type TasteAxisBand,
  type TasteAxisConfidence,
  type TasteAxisName,
} from '@brewmate/shared';

import { TASTE_AXIS_ORDER } from '../constants/tasteAxes';

export interface TasteAxisReading {
  readonly axis: TasteAxisName;
  readonly value: number;
  /** The value as a share of the full scale, which is all the web needs. */
  readonly share: number;
  readonly confidence: number;
  /** Whether anything at all has been heard about this axis. */
  readonly known: boolean;
  readonly band: TasteAxisBand;
}

/**
 * The five axes in their fixed order, each carrying what it is worth.
 *
 * The value and the confidence travel together because they are meaningless
 * apart. A five on an axis nobody has mentioned and a five somebody arrived at
 * after twenty cups are the same number and completely different facts, and
 * every screen that draws one of them has to be able to tell which it is
 * holding - otherwise the honest answer gets left off wherever somebody forgot
 * to add it, which is how a chart ends up quietly claiming to know things.
 */
export const readTasteAxisReadings = (
  axes: TasteAxes,
  axisConfidence: TasteAxisConfidence,
): readonly TasteAxisReading[] =>
  TASTE_AXIS_ORDER.map((axis: TasteAxisName): TasteAxisReading => {
    const value = axes[axis];
    const confidence = axisConfidence[axis];

    return {
      axis,
      value,
      share: value / TASTE_AXIS_MAX,
      confidence,
      known: isAxisKnown(confidence),
      band: resolveTasteAxisBand(value),
    };
  });

/**
 * Whether there is anything behind the chart at all.
 *
 * A profile built from no evidence is five middles, and five middles drawn
 * neatly stop looking like an absence of evidence and start looking like a
 * considered opinion. Nothing draws the web until this is true.
 */
export const hasKnownAxis = (axisConfidence: TasteAxisConfidence): boolean =>
  TASTE_AXIS_ORDER.some((axis: TasteAxisName): boolean => isAxisKnown(axisConfidence[axis]));
