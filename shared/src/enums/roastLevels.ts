/**
 * How dark a coffee was roasted.
 *
 * A taste profile's `roastPreference` reuses this same set and is nullable -
 * `null` means "no preference". A second, near-identical enum would be a
 * second place to forget a value.
 */
export const ROAST_LEVELS = {
  light: 'light',
  mediumLight: 'medium_light',
  medium: 'medium',
  mediumDark: 'medium_dark',
  dark: 'dark',
} as const;

export type RoastLevel = (typeof ROAST_LEVELS)[keyof typeof ROAST_LEVELS];

/** Tuple form, required by Drizzle's `pgEnum`. */
export const ROAST_LEVEL_VALUES = [
  ROAST_LEVELS.light,
  ROAST_LEVELS.mediumLight,
  ROAST_LEVELS.medium,
  ROAST_LEVELS.mediumDark,
  ROAST_LEVELS.dark,
] as const;
