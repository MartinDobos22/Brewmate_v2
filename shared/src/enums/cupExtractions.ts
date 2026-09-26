/**
 * What somebody said about how a cup extracted, in brewing terms.
 *
 * `under` is sour, sharp, thin or hollow; `over` is bitter, harsh or drying;
 * `balanced` is them saying it was right. Read by a model out of a sentence
 * like "bola kyslá" and stored on the cup, because it is the one thing about a
 * cup the numbers on it cannot say: where the person would have wanted it to
 * be instead.
 */
export const CUP_EXTRACTIONS = {
  under: 'under',
  over: 'over',
  balanced: 'balanced',
} as const;

export type CupExtraction = (typeof CUP_EXTRACTIONS)[keyof typeof CUP_EXTRACTIONS];

export const CUP_EXTRACTION_VALUES = [
  CUP_EXTRACTIONS.under,
  CUP_EXTRACTIONS.over,
  CUP_EXTRACTIONS.balanced,
] as const;
