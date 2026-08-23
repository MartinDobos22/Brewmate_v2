import type { ThemePreference } from '../../theme/colorScheme';

import { useUiStore, type UiState } from './uiStore';

/**
 * One selector per value. Subscribing to a slice instead of the whole store
 * keeps a change to one preference from re-rendering everything that reads
 * another.
 */
export const useThemePreference = (): ThemePreference =>
  useUiStore((state: UiState) => state.themePreference);

export const useSetThemePreference = (): ((preference: ThemePreference) => void) =>
  useUiStore((state: UiState) => state.setThemePreference);

export const useGettingStartedHidden = (): boolean =>
  useUiStore((state: UiState) => state.gettingStartedHidden);

export const useHideGettingStarted = (): (() => void) =>
  useUiStore((state: UiState) => state.hideGettingStarted);
