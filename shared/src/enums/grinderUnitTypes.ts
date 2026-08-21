/**
 * The scale printed on a grinder's adjustment collar. Two grinders are only
 * comparable through `micronCalibration`, never through the raw number.
 */
export const GRINDER_UNIT_TYPES = {
  clicks: 'clicks',
  numbers: 'numbers',
  microns: 'microns',
} as const;

export type GrinderUnitType = (typeof GRINDER_UNIT_TYPES)[keyof typeof GRINDER_UNIT_TYPES];

/** Tuple form, required by Drizzle's `pgEnum`. */
export const GRINDER_UNIT_TYPE_VALUES = [
  GRINDER_UNIT_TYPES.clicks,
  GRINDER_UNIT_TYPES.numbers,
  GRINDER_UNIT_TYPES.microns,
] as const;
