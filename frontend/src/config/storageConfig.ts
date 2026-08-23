import { ENVIRONMENT_KEYS } from './environmentKeys';
import { readEnvironmentVariable } from './readEnvironmentVariable';

/**
 * The bucket photographed bags are uploaded to.
 *
 * Optional, like the Google client IDs: a build without it hides the camera
 * and offers the form instead of failing when somebody presses the button.
 * Typing a label in has to work without any of this anyway - it is the path
 * somebody falls back to in a shop with no signal.
 */
export const readStorageBucket = (): string | undefined =>
  readEnvironmentVariable(ENVIRONMENT_KEYS.firebaseStorageBucket);

export const isPhotoScanningConfigured = (): boolean => readStorageBucket() !== undefined;
