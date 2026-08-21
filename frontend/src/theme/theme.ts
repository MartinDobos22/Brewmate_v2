import type { ColorScheme } from './colorScheme';
import {
  BORDER_WIDTH,
  DARK_COLORS,
  DURATION,
  EASING,
  ELEVATION,
  LAYOUT_SPACING,
  LIGHT_COLORS,
  OPACITY,
  RADIUS,
  RELATIVE_SIZE,
  SHAPE,
  SIZE,
  SPACING,
  TYPOGRAPHY,
  type ColorPalette,
} from './tokens';

/** Everything a component is allowed to style itself with. */
export interface Theme {
  readonly scheme: ColorScheme;
  readonly colors: ColorPalette;
  readonly typography: typeof TYPOGRAPHY;
  readonly spacing: typeof SPACING;
  readonly layout: typeof LAYOUT_SPACING;
  readonly radius: typeof RADIUS;
  readonly shape: typeof SHAPE;
  readonly elevation: typeof ELEVATION;
  readonly borderWidth: typeof BORDER_WIDTH;
  readonly opacity: typeof OPACITY;
  readonly duration: typeof DURATION;
  readonly easing: typeof EASING;
  readonly size: typeof SIZE;
  readonly relativeSize: typeof RELATIVE_SIZE;
}

const createTheme = (scheme: ColorScheme, colors: ColorPalette): Theme => ({
  scheme,
  colors,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  layout: LAYOUT_SPACING,
  radius: RADIUS,
  shape: SHAPE,
  elevation: ELEVATION,
  borderWidth: BORDER_WIDTH,
  opacity: OPACITY,
  duration: DURATION,
  easing: EASING,
  size: SIZE,
  relativeSize: RELATIVE_SIZE,
});

export const LIGHT_THEME: Theme = createTheme('light', LIGHT_COLORS);
export const DARK_THEME: Theme = createTheme('dark', DARK_COLORS);

export const THEMES: Record<ColorScheme, Theme> = {
  light: LIGHT_THEME,
  dark: DARK_THEME,
};
