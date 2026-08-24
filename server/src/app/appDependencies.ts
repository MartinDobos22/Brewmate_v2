import type { IdentityDeleter } from '../auth/identityDeleter.js';
import type { TokenVerifier } from '../auth/tokenVerifier.js';
import type { AppConfig } from '../config/appConfig.js';
import type { Database } from '../db/databaseTypes.js';
import type { ErrorTracker } from '../telemetry/errorTracker.js';

import type { AiDependencies } from './aiDependencies.js';

/**
 * Everything the HTTP layer needs, injected from outside so tests can swap the
 * identity provider and the database branch.
 */
export interface AppDependencies {
  readonly config: AppConfig;
  readonly db: Database;
  readonly tokenVerifier: TokenVerifier;
  readonly identityDeleter: IdentityDeleter;
  /**
   * Where unexpected failures go besides the log. Injected like the identity
   * provider, so a test can assert that a 500 was reported without a third
   * party being involved.
   */
  readonly errorTracker: ErrorTracker;
  /**
   * Null wherever no model provider is configured - in the tests, and in any
   * deployment without a key. The two AI routes then answer "not available
   * right now", which is what lets the app offer the form instead.
   */
  readonly ai: AiDependencies | null;
}
