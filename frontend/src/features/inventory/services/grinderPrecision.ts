import type { Grinder } from '@brewmate/shared';

/**
 * How much a micron conversion for this grinder is worth.
 *
 * `measured` is reserved for a curve somebody actually measured. Everything
 * the catalogue ships is `estimated`, because published microns-per-click
 * figures are approximate and burr alignment moves them; a grinder with no
 * curve at all is `missing`, and the app says the conversion will be rougher
 * rather than quietly guessing one.
 */
export const GRINDER_PRECISIONS = {
  measured: 'measured',
  estimated: 'estimated',
  missing: 'missing',
} as const;

export type GrinderPrecision = (typeof GRINDER_PRECISIONS)[keyof typeof GRINDER_PRECISIONS];

export const resolveGrinderPrecision = (grinder: Grinder): GrinderPrecision => {
  if (grinder.micronCalibration === null) {
    return GRINDER_PRECISIONS.missing;
  }

  return grinder.micronCalibration.isEstimated
    ? GRINDER_PRECISIONS.estimated
    : GRINDER_PRECISIONS.measured;
};
