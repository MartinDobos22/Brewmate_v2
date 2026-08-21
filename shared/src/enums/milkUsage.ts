/** How often the user drinks the coffee with milk. Shifts the whole profile. */
export const MILK_USAGE_LEVELS = {
  never: 'never',
  sometimes: 'sometimes',
  often: 'often',
  always: 'always',
} as const;

export type MilkUsage = (typeof MILK_USAGE_LEVELS)[keyof typeof MILK_USAGE_LEVELS];

/** Tuple form, required by Drizzle's `pgEnum`. */
export const MILK_USAGE_VALUES = [
  MILK_USAGE_LEVELS.never,
  MILK_USAGE_LEVELS.sometimes,
  MILK_USAGE_LEVELS.often,
  MILK_USAGE_LEVELS.always,
] as const;
