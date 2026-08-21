import type { JSX, ReactNode } from 'react';
import { useColorScheme, type ColorSchemeName } from 'react-native';

import { useThemePreference } from '../stores/uiStore';

import {
  COLOR_SCHEMES,
  THEME_PREFERENCES,
  type ColorScheme,
  type ThemePreference,
} from './colorScheme';
import { THEMES } from './theme';
import { ThemeContext } from './themeContext';

export interface ThemeProviderProps {
  readonly children: ReactNode;
  /** Forces a scheme regardless of preference. Used by the design system screen. */
  readonly forcedScheme?: ColorScheme;
}

const resolveScheme = (preference: ThemePreference, systemScheme: ColorSchemeName): ColorScheme => {
  if (preference !== THEME_PREFERENCES.system) {
    return preference;
  }

  return systemScheme === COLOR_SCHEMES.dark ? COLOR_SCHEMES.dark : COLOR_SCHEMES.light;
};

export const ThemeProvider = ({ children, forcedScheme }: ThemeProviderProps): JSX.Element => {
  const systemScheme = useColorScheme();
  const preference = useThemePreference();
  const scheme = forcedScheme ?? resolveScheme(preference, systemScheme);

  return <ThemeContext.Provider value={THEMES[scheme]}>{children}</ThemeContext.Provider>;
};
