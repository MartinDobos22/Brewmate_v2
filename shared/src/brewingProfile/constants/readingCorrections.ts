import { CUP_EXTRACTIONS, type CupExtraction } from '../../enums/cupExtractions.js';
import { CUP_STRENGTHS, type CupStrength } from '../../enums/cupStrengths.js';

/**
 * Which way a cup's own grind is moved to find where it should have been.
 *
 * Sour and thin is under-extracted, and the fix that works on every brewer is
 * finer; bitter and drying is the opposite. Positive is coarser, as in every
 * grind shift.
 */
export const EXTRACTION_GRIND_DIRECTION: Record<CupExtraction, number> = {
  [CUP_EXTRACTIONS.under]: -1,
  [CUP_EXTRACTIONS.over]: 1,
  [CUP_EXTRACTIONS.balanced]: 0,
};

/** The same complaint, read as a temperature: hotter extracts more, cooler less. */
export const EXTRACTION_TEMPERATURE_DIRECTION: Record<CupExtraction, number> = {
  [CUP_EXTRACTIONS.under]: 1,
  [CUP_EXTRACTIONS.over]: -1,
  [CUP_EXTRACTIONS.balanced]: 0,
};

/**
 * Which way the ratio should have gone. A watery cup wanted less water per
 * gram of coffee, which is a smaller ratio; a heavy one wanted more.
 */
export const STRENGTH_RATIO_DIRECTION: Record<CupStrength, number> = {
  [CUP_STRENGTHS.weak]: -1,
  [CUP_STRENGTHS.strong]: 1,
  [CUP_STRENGTHS.right]: 0,
};
