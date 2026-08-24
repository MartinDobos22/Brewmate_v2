/**
 * The stages of bringing somebody else's recipe in.
 *
 * Three, and the middle one is the one that matters: what was read is shown
 * back before anything is converted. A conversion is a chain of numbers
 * multiplying into each other, and a misread dose at the top of it comes out
 * as a grind setting at the bottom with nothing to point at.
 */
export const IMPORT_STAGES = {
  source: 'source',
  review: 'review',
  target: 'target',
  result: 'result',
} as const;

export type ImportStage = (typeof IMPORT_STAGES)[keyof typeof IMPORT_STAGES];

/** Where a photographed recipe is filed in the bucket. */
export const RECIPE_PHOTO_FOLDER = 'recipe-scans';
