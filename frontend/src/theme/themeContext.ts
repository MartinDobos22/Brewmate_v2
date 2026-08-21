import { createContext } from 'react';

import { LIGHT_THEME, type Theme } from './theme';

/**
 * Defaults to the light theme so a component rendered outside the provider
 * (a test, a Storybook-style preview) still has real tokens to work with.
 */
export const ThemeContext = createContext<Theme>(LIGHT_THEME);
