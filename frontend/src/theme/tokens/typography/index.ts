import { NUMERIC_SCALE } from './numericScale';
import { REDESIGN_SCALE } from './redesignScale';

export { FONT_FAMILIES } from './fontFamilies';
export type { FontFamilyToken } from './fontFamilies';
export { NUMERIC_SCALE } from './numericScale';
export type { NumericScaleToken } from './numericScale';
export { REDESIGN_SCALE } from './redesignScale';
export type { RedesignScaleToken } from './redesignScale';
export type { TypographyStyle } from './typographyStyle';

/** The full set of text styles a component may reference. */
export const TYPOGRAPHY = { ...REDESIGN_SCALE, ...NUMERIC_SCALE } as const;

export type TypographyToken = keyof typeof TYPOGRAPHY;
