import {
  CALIBRATION_ESTIMATED_BY_DEFAULT,
  type MicronCalibration,
  type MicronCalibrationPoint,
} from '@brewmate/shared';

/**
 * Marks a curve as what it is: an estimate.
 *
 * Every figure in this catalogue is read off a manufacturer's "microns per
 * click" specification or a widely repeated community chart. None of it was
 * measured with a sieve set or a laser diffractometer, and burr alignment
 * alone moves the numbers, so the app is told to present them as guidance
 * rather than as measurements. A curve here is deliberately two or three wide
 * points rather than a dense table it has not earned.
 */
export const estimatedCalibration = (
  points: readonly MicronCalibrationPoint[],
): MicronCalibration => ({
  points: [...points],
  isEstimated: CALIBRATION_ESTIMATED_BY_DEFAULT,
});
