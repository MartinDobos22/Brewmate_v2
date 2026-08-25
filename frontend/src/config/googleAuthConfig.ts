import { ENVIRONMENT_KEYS } from './environmentKeys';
import { readEnvironmentVariable } from './readEnvironmentVariable';

/**
 * OAuth client IDs for Google Sign-In. One per platform, all of them public
 * identifiers rather than secrets.
 *
 * Google Sign-In is optional: a build without these IDs simply does not offer
 * the button, instead of crashing when it is pressed.
 */
export interface GoogleAuthConfig {
  readonly webClientId: string | undefined;
  readonly iosClientId: string | undefined;
  readonly androidClientId: string | undefined;
}

export const readGoogleAuthConfig = (): GoogleAuthConfig => ({
  webClientId: readEnvironmentVariable(ENVIRONMENT_KEYS.googleWebClientId),
  iosClientId: readEnvironmentVariable(ENVIRONMENT_KEYS.googleIosClientId),
  androidClientId: readEnvironmentVariable(ENVIRONMENT_KEYS.googleAndroidClientId),
});

/**
 * The web client ID doubles as the fallback for every platform, so it is the
 * one value the flow cannot start without.
 */
export const isGoogleAuthConfigured = (config: GoogleAuthConfig): boolean =>
  config.webClientId !== undefined;
