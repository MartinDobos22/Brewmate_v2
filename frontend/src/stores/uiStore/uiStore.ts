import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { APP_CONFIG } from '../../constants/config';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import type { ThemePreference } from '../../theme/colorScheme';

/**
 * UI state only - what the user is looking at and how they want it to look.
 * Server data lives in TanStack Query, never here.
 *
 * Onboarding progress deliberately does not live here. It belongs to the
 * account rather than to the device, so it is stored in
 * `users.onboarding_state` and read through `/me`: reinstalling the app or
 * signing in on a second phone must not hand somebody a flow they already
 * finished.
 */
export interface UiState {
  readonly themePreference: ThemePreference;
  readonly setThemePreference: (preference: ThemePreference) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      themePreference: APP_CONFIG.defaultThemePreference,
      setThemePreference: (themePreference: ThemePreference): void => {
        set({ themePreference });
      },
    }),
    {
      name: STORAGE_KEYS.uiPreferences,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ themePreference }: UiState) => ({ themePreference }),
    },
  ),
);
