import {
  NUMERIC_SCALE,
  TYPOGRAPHY,
  type ColorPalette,
  type ElevationToken,
  type RadiusToken,
  type SpacingToken,
  type TypographyToken,
} from '../../../theme';

/** Which colour roles the screen shows, in the order they are shown. */
export const PREVIEW_COLOR_ROLES: readonly (keyof ColorPalette)[] = [
  'primary',
  'primaryContainer',
  'secondary',
  'secondaryContainer',
  'tertiary',
  'tertiaryContainer',
  'background',
  'surface',
  'surfaceContainer',
  'surfaceContainerHigh',
  'outline',
  'outlineVariant',
  'error',
  'errorContainer',
];

export const PREVIEW_RADIUS_TOKENS: readonly RadiusToken[] = ['xs', 'sm', 'md', 'lg', 'xl', 'full'];

export const PREVIEW_SPACING_TOKENS: readonly SpacingToken[] = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'xxl',
  'xxxl',
];

export const PREVIEW_ELEVATION_TOKENS: readonly ElevationToken[] = ['none', 'raised', 'overlay'];

const isTypographyToken = (key: string): key is TypographyToken => key in TYPOGRAPHY;

/** Every entry of the type scale, in declaration order. */
export const PREVIEW_TYPOGRAPHY_TOKENS: readonly TypographyToken[] =
  Object.keys(TYPOGRAPHY).filter(isTypographyToken);

/** Monospaced entries render with tabular numerals, like they do in brew mode. */
export const isNumericToken = (token: TypographyToken): boolean => token in NUMERIC_SCALE;
