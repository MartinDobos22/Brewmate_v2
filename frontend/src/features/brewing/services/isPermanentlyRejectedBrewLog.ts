import type { ErrorCode } from '@brewmate/shared';

import { ApiClientError } from '../../../lib/apiClient';
import { PERMANENTLY_REJECTED_BREW_LOG_CODES } from '../constants/pendingBrewLogs';

/**
 * Whether offering this brew again could ever work.
 *
 * The queue exists because the phone had no signal, so the default answer is
 * "keep it" - a brew is a fact, and the app has no business deciding a cup did
 * not happen because one POST came back badly. Only a refusal about the
 * request itself is treated as final.
 */
export const isPermanentlyRejectedBrewLog = (error: unknown): boolean =>
  error instanceof ApiClientError &&
  PERMANENTLY_REJECTED_BREW_LOG_CODES.some((code: ErrorCode): boolean => code === error.code);
