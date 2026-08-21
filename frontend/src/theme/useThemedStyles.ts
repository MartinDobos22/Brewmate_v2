import { useMemo } from 'react';

import type { Theme } from './theme';
import { useTheme } from './useTheme';

/** A stylesheet factory: takes the theme, returns a `StyleSheet.create` result. */
export type StyleFactory<TStyles> = (theme: Theme) => TStyles;

/**
 * Builds a component's stylesheet from the active theme and memoises it, so a
 * theme switch rebuilds the styles and nothing else does.
 */
export const useThemedStyles = <TStyles>(factory: StyleFactory<TStyles>): TStyles => {
  const theme = useTheme();

  return useMemo(() => factory(theme), [factory, theme]);
};
