import { z } from 'zod';

import {
  GRIND_MICRONS_MAX,
  GRIND_MICRONS_MIN,
  GRINDER_SETTING_MAX,
  GRINDER_SETTING_MIN,
  MICRON_CALIBRATION_POINTS_MAX,
} from './grinderFieldLimits.js';

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
 */
export const micronCalibrationSchema = z.object({
  points: z.array(micronCalibrationPointSchema).max(MICRON_CALIBRATION_POINTS_MAX),
});

export type MicronCalibration = z.infer<typeof micronCalibrationSchema>;
