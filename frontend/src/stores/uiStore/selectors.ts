import type { ThemePreference } from '../../theme/colorScheme';

import { useUiStore, type UiState } from './uiStore';

/**
 * One selector per value. Subscribing to a slice instead of the whole store
 * keeps a theme change from re-rendering everything that reads onboarding.
 */
export const useThemePreference = (): ThemePreference =>
  useUiStore((state: UiState) => state.themePreference);

export const useSetThemePreference = (): ((preference: ThemePreference) => void) =>
  useUiStore((state: UiState) => state.setThemePreference);

export const useHasCompletedOnboarding = (): boolean =>
  useUiStore((state: UiState) => state.hasCompletedOnboarding);

export const useSetHasCompletedOnboarding = (): ((completed: boolean) => void) =>
  useUiStore((state: UiState) => state.setHasCompletedOnboarding);
