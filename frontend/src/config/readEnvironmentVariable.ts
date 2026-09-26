import type { EnvironmentKey } from './environmentKeys';
import { ENVIRONMENT_VALUES } from './environmentValues';

/**
 * Reads one variable, treating an empty one as absent.
 *
 * The value comes from ENVIRONMENT_VALUES rather than from `process.env[key]`:
 * Expo inlines only static member accesses, so a computed read is empty in a
 * release build. See that file for the whole story.
 *
 * `.env` lists every optional variable with nothing after the `=`, so
 * that somebody can see what a build could carry - and Expo inlines that as an
 * empty string rather than leaving it out. Without this, a checkout that has
 * not been given a storage bucket would report photo scanning as configured,
 * offer the camera, and fail at the upload in a shop.
 */
export const readEnvironmentVariable = (key: EnvironmentKey): string | undefined => {
  const value = ENVIRONMENT_VALUES[key];

  return value === undefined || value === '' ? undefined : value;
};
