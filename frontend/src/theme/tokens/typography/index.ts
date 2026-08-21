import { NUMERIC_SCALE } from './numericScale';
import { TYPE_SCALE } from './typeScale';

export { FONT_FAMILIES } from './fontFamilies';
export type { FontFamilyToken } from './fontFamilies';
export { TYPE_SCALE } from './typeScale';
export type { TypeScaleToken } from './typeScale';
export { NUMERIC_SCALE } from './numericScale';
export type { NumericScaleToken } from './numericScale';
export type { TypographyStyle } from './typographyStyle';

/** The full set of text styles a component may reference. */
export const TYPOGRAPHY = { ...TYPE_SCALE, ...NUMERIC_SCALE } as const;

export type TypographyToken = keyof typeof TYPOGRAPHY;
