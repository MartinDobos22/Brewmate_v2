import { LABEL_SCALE } from './labelScale';
import { READING_SCALE } from './readingScale';

/**
 * The redesign's own type, and now the only scale in the app.
 *
 * Split in two because one file of twenty-four entries broke the line limit,
 * and the seam is the honest one: what a screen says, and what it names.
 */
export const REDESIGN_SCALE = { ...READING_SCALE, ...LABEL_SCALE } as const;

export type RedesignScaleToken = keyof typeof REDESIGN_SCALE;
