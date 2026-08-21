import type { IdentityDeleter } from '../auth/identityDeleter.js';
import type { TokenVerifier } from '../auth/tokenVerifier.js';
import type { AppConfig } from '../config/appConfig.js';
import type { Database } from '../db/databaseTypes.js';

/**
 * Everything the HTTP layer needs, injected from outside so tests can swap the
 * identity provider and the database branch.
 */
export interface AppDependencies {
  readonly config: AppConfig;
  readonly db: Database;
  readonly tokenVerifier: TokenVerifier;
  readonly identityDeleter: IdentityDeleter;
}
