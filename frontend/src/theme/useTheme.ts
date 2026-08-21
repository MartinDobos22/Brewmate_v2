import { useContext } from 'react';

import type { Theme } from './theme';
import { ThemeContext } from './themeContext';

/** The single way a component reads design tokens. */
export const useTheme = (): Theme => useContext(ThemeContext);
