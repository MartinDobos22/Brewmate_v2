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
  'surfaceVariant',
  'surfaceDim',
  'surfaceTint',
  'divider',
  'dividerStrong',
  'outlineFaint',
  'outlineDashed',
  'onSurfaceEmpty',
  'onSurfaceEmptyStrong',
  'freshContainer',
  'cautionContainer',
  'roastMid',
  'espresso',
  'espressoDeep',
  'espressoLift',
  'espressoLine',
  'accentOnEspresso',
  'accentSoft',
  'cream',
  'brewGround',
  'brewSurface',
  'brewChip',
  'brewTrack',
  'brewArc',
];

export const PREVIEW_RADIUS_TOKENS: readonly RadiusToken[] = [
  'xxs',
  'xs',
  'sm',
  'md',
  'lg',
  'lgPlus',
  'xl',
  'xxl',
  'xxxl',
  'full',
];

export const PREVIEW_SPACING_TOKENS: readonly SpacingToken[] = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'xxl',
  'xxxl',
];

export const PREVIEW_ELEVATION_TOKENS: readonly ElevationToken[] = [
  'none',
  'raised',
  'overlay',
  'card',
  'cardEmphasis',
  'buttonDark',
  'cardSelected',
  'pillOnEspresso',
  'cardHero',
  'brewControl',
  'footBar',
];

const isTypographyToken = (key: string): key is TypographyToken => key in TYPOGRAPHY;

/** Every entry of the type scale, in declaration order. */
export const PREVIEW_TYPOGRAPHY_TOKENS: readonly TypographyToken[] =
  Object.keys(TYPOGRAPHY).filter(isTypographyToken);

/** Monospaced entries render with tabular numerals, like they do in brew mode. */
export const isNumericToken = (token: TypographyToken): boolean => token in NUMERIC_SCALE;
