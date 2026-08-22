/** How a recipe came to exist. */
export const RECIPE_SOURCES = {
  ai: 'ai',
  manual: 'manual',
  imported: 'imported',
  adjusted: 'adjusted',
  calibration: 'calibration',
} as const;

export type RecipeSource = (typeof RECIPE_SOURCES)[keyof typeof RECIPE_SOURCES];

/** Tuple form, required by Drizzle's `pgEnum`. */
export const RECIPE_SOURCE_VALUES = [
  RECIPE_SOURCES.ai,
  RECIPE_SOURCES.manual,
  RECIPE_SOURCES.imported,
  RECIPE_SOURCES.adjusted,
  RECIPE_SOURCES.calibration,
] as const;
