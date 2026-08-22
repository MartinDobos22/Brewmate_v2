import { z } from 'zod';

import {
  GRIND_MICRONS_MAX,
  GRIND_MICRONS_MIN,
  GRINDER_SETTING_MAX,
  GRINDER_SETTING_MIN,
  MICRON_CALIBRATION_POINTS_MAX,
} from './grinderFieldLimits.js';

/**
 * A curve nobody has measured is an estimate until somebody says otherwise.
 * The shipped catalogue is read off manufacturer specs and community charts,
 * so this is what almost every entry carries.
 */
export const CALIBRATION_ESTIMATED_BY_DEFAULT = true;

/** One measured pair: this collar setting produced roughly these microns. */
export const micronCalibrationPointSchema = z.object({
  setting: z.number().min(GRINDER_SETTING_MIN).max(GRINDER_SETTING_MAX),
  microns: z.number().min(GRIND_MICRONS_MIN).max(GRIND_MICRONS_MAX),
});

export type MicronCalibrationPoint = z.infer<typeof micronCalibrationPointSchema>;

/**
 * The curve that makes two different grinders comparable.
 *
 * A list rather than columns: the number of measured points differs per
 * grinder, and everything in between is interpolated in code.
 *
 * `isEstimated` is the honesty flag. Published micron figures exist for only
 * some grinders and are approximate even there, so a curve says out loud
 * whether it was measured or guessed at, and the app labels it accordingly
 * instead of showing a number that looks like a fact.
 */
export const micronCalibrationSchema = z.object({
  points: z.array(micronCalibrationPointSchema).max(MICRON_CALIBRATION_POINTS_MAX),
  isEstimated: z.boolean().default(CALIBRATION_ESTIMATED_BY_DEFAULT),
});

export type MicronCalibration = z.infer<typeof micronCalibrationSchema>;
