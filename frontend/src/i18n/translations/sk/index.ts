import { SK_AUTH } from './auth';
import { SK_COMMON } from './common';
import { SK_DESIGN_SYSTEM } from './designSystem';
import { SK_ERRORS } from './errors';
import { SK_NAVIGATION } from './navigation';
import { SK_SCREENS } from './screens';

/**
 * Slovak copy. This object is the source of truth for the key list: every
 * other locale is typed against it, so a missing translation is a type error.
 */
export const SK_TRANSLATIONS = {
  ...SK_COMMON,
  ...SK_AUTH,
  ...SK_NAVIGATION,
  ...SK_SCREENS,
  ...SK_ERRORS,
  ...SK_DESIGN_SYSTEM,
} as const;
