/**
 * How the water used for brewing was prepared. Water is the largest single
 * ingredient in a cup, so every recipe and every brew log records it.
 */
export const WATER_TYPES = {
  tap: 'tap',
  bottled: 'bottled',
  filtered: 'filtered',
  remineralized: 'remineralized',
  unknown: 'unknown',
} as const;

export type WaterType = (typeof WATER_TYPES)[keyof typeof WATER_TYPES];

/** Tuple form, required by Drizzle's `pgEnum`. */
export const WATER_TYPE_VALUES = [
  WATER_TYPES.tap,
  WATER_TYPES.bottled,
  WATER_TYPES.filtered,
  WATER_TYPES.remineralized,
  WATER_TYPES.unknown,
] as const;
