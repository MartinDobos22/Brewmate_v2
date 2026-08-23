import type { IdentityDeleter } from '../auth/identityDeleter.js';
import type { TokenVerifier } from '../auth/tokenVerifier.js';
import type { AppConfig } from '../config/appConfig.js';
import type { Database } from '../db/databaseTypes.js';

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
   * Null wherever no model provider is configured - in the tests, and in any
   * deployment without a key. The two AI routes then answer "not available
   * right now", which is what lets the app offer the form instead.
   */
  readonly ai: AiDependencies | null;
}
