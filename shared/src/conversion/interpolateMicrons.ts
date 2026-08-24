import { GRIND_MICRONS_MAX, GRIND_MICRONS_MIN } from '../grinders/grinderFieldLimits.js';
import type {
  MicronCalibration,
  MicronCalibrationPoint,
} from '../grinders/micronCalibrationSchema.js';

import {
  CALIBRATION_EXTRAPOLATION_LIMIT,
  CALIBRATION_POINTS_REQUIRED,
  GRIND_MICRON_DECIMALS,
  GRIND_SETTING_DECIMALS,
} from './conversionFieldLimits.js';

const FIRST = 0;
const NEXT = 1;
const ROUNDING_BASE = 10;
const NO_SPAN = 0;

const round = (value: number, decimals: number): number => {
  const factor = ROUNDING_BASE ** decimals;

  return Math.round(value * factor) / factor;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * A reading off a curve, and whether the curve actually covered it.
 *
 * The flag travels with the number rather than being worked out again by the
 * caller, because it is the difference between a conversion that interpolated
 * between two measured points and one that carried a straight line off the end
 * of what anybody measured. Both are useful; only one of them is a reading.
 */
export interface CurveReading {
  readonly value: number;
  readonly isExtrapolated: boolean;
}

/** One measured pair, reduced to the axis being read along and the axis being read off. */
interface CurvePoint {
  readonly x: number;
  readonly y: number;
}

/**
 * The value of `y` at `x`, along the straight line between the two points that
 * bracket it.
 *
 * Piecewise linear rather than a fitted curve, because the data does not
 * deserve better: a published calibration is two or three wide points read off
 * a manufacturer's sheet, and a spline through three approximate points is a
 * more elaborate way of being equally wrong.
 *
 * @returns the reading, or null when `x` falls so far outside the measured
 * span that the line would be an invention rather than an extension.
 */
const readCurve = (points: readonly CurvePoint[], x: number): CurveReading | null => {
  const first = points[FIRST];
  const last = points[points.length - NEXT];

  if (first === undefined || last === undefined) {
    return null;
  }

  const span = last.x - first.x;

  if (span <= NO_SPAN) {
    return null;
  }

  const overshoot = Math.max(first.x - x, x - last.x);

  if (overshoot > span * CALIBRATION_EXTRAPOLATION_LIMIT) {
    return null;
  }

  const upperIndex = points.findIndex((point: CurvePoint): boolean => point.x > x);
  const upperAt = upperIndex === -1 ? points.length - NEXT : Math.max(upperIndex, NEXT);
  const lower = points[upperAt - NEXT];
  const upper = points[upperAt];

  if (lower === undefined || upper === undefined || upper.x === lower.x) {
    return null;
  }

  const slope = (upper.y - lower.y) / (upper.x - lower.x);

  return { value: lower.y + (x - lower.x) * slope, isExtrapolated: x < first.x || x > last.x };
};

/** The curve as points along one axis, sorted, or null when there is no curve to read. */
const toCurve = (
  calibration: MicronCalibration | null,
  read: (point: MicronCalibrationPoint) => CurvePoint,
): readonly CurvePoint[] | null => {
  if (calibration === null || calibration.points.length < CALIBRATION_POINTS_REQUIRED) {
    return null;
  }

  return calibration.points
    .map(read)
    .sort((left: CurvePoint, right: CurvePoint): number => left.x - right.x);
};

const alongSettings = (point: MicronCalibrationPoint): CurvePoint => ({
  x: point.setting,
  y: point.microns,
});

const alongMicrons = (point: MicronCalibrationPoint): CurvePoint => ({
  x: point.microns,
  y: point.setting,
});

/**
 * What this collar setting grinds to, in microns.
 *
 * The one operation that makes two different grinders comparable at all. Every
 * conversion of a grind goes through microns rather than through any
 * relationship between the two collars, because there is no such relationship:
 * "22" on a Comandante and "22" on a JX-Pro have nothing to do with each other
 * beyond both being numbers somebody printed on a knob.
 */
export const settingToMicrons = (
  calibration: MicronCalibration | null,
  setting: number,
): CurveReading | null => {
  const curve = toCurve(calibration, alongSettings);

  if (curve === null) {
    return null;
  }

  const reading = readCurve(curve, setting);

  return reading === null
    ? null
    : {
        value: round(
          clamp(reading.value, GRIND_MICRONS_MIN, GRIND_MICRONS_MAX),
          GRIND_MICRON_DECIMALS,
        ),
        isExtrapolated: reading.isExtrapolated,
      };
};

/** The collar setting this grinder reaches a given particle size at. */
export const micronsToSetting = (
  calibration: MicronCalibration | null,
  microns: number,
  bounds: { readonly min: number; readonly max: number },
): CurveReading | null => {
  const curve = toCurve(calibration, alongMicrons);

  if (curve === null) {
    return null;
  }

  const reading = readCurve(curve, microns);

  return reading === null
    ? null
    : {
        value: round(clamp(reading.value, bounds.min, bounds.max), GRIND_SETTING_DECIMALS),
        isExtrapolated: reading.isExtrapolated,
      };
};

/**
 * The nearest setting the collar can actually be left at.
 *
 * A clicked grinder has detents and a number between two of them is not a
 * setting anybody can dial; a stepless collar records its step as zero and is
 * left alone. Rounding here rather than at the call site means the number
 * stored on the recipe is the number the person turns their grinder to.
 */
export const snapToStep = (setting: number, step: number, minSetting: number): number => {
  if (step <= NO_SPAN) {
    return round(setting, GRIND_SETTING_DECIMALS);
  }

  return round(
    minSetting + Math.round((setting - minSetting) / step) * step,
    GRIND_SETTING_DECIMALS,
  );
};
