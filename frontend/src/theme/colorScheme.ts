/** The two colour schemes the app ships. */
export const COLOR_SCHEMES = {
  light: 'light',
  dark: 'dark',
} as const;

export type ColorScheme = (typeof COLOR_SCHEMES)[keyof typeof COLOR_SCHEMES];

/** What the user picked in settings: a fixed scheme, or "follow the system". */
export const THEME_PREFERENCES = {
  system: 'system',
  light: COLOR_SCHEMES.light,
  dark: COLOR_SCHEMES.dark,
} as const;

export type ThemePreference = (typeof THEME_PREFERENCES)[keyof typeof THEME_PREFERENCES];
