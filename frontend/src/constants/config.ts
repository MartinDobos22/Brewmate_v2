import { THEME_PREFERENCES, type ThemePreference } from '../theme/colorScheme';

/** App-wide behaviour switches that are not read from the environment. */
export interface AppConfig {
  /** Follow the system appearance until the user picks a scheme themselves. */
  readonly defaultThemePreference: ThemePreference;
  /** Restore the query cache from storage on a cold start. */
  readonly persistQueryCache: boolean;
  /** The design system screen is a development tool and ships nowhere else. */
  readonly designSystemScreenEnabled: boolean;
}

declare const __DEV__: boolean;

export const APP_CONFIG: AppConfig = {
  defaultThemePreference: THEME_PREFERENCES.system,
  persistQueryCache: true,
  designSystemScreenEnabled: __DEV__,
};
