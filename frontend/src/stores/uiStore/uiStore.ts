import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { APP_CONFIG } from '../../constants/config';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import type { ThemePreference } from '../../theme/colorScheme';

/**
 * UI state only - what the user is looking at and how they want it to look.
 * Server data lives in TanStack Query, never here.
 */
export interface UiState {
  readonly themePreference: ThemePreference;
  readonly hasCompletedOnboarding: boolean;
  readonly setThemePreference: (preference: ThemePreference) => void;
  readonly setHasCompletedOnboarding: (completed: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      themePreference: APP_CONFIG.defaultThemePreference,
      hasCompletedOnboarding: false,
      setThemePreference: (themePreference: ThemePreference): void => {
        set({ themePreference });
      },
      setHasCompletedOnboarding: (hasCompletedOnboarding: boolean): void => {
        set({ hasCompletedOnboarding });
      },
    }),
    {
      name: STORAGE_KEYS.uiPreferences,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ themePreference, hasCompletedOnboarding }: UiState) => ({
        themePreference,
        hasCompletedOnboarding,
      }),
    },
  ),
);
