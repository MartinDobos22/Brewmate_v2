/** Font sizes, line heights and weights. */
export const FONT_SIZES = {
  caption: 12,
  body: 16,
  title: 22,
  display: 30,
} as const;

export const LINE_HEIGHTS = {
  caption: 16,
  body: 24,
  title: 28,
  display: 36,
} as const;

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  bold: '700',
} as const;

export type FontSizeToken = keyof typeof FONT_SIZES;
