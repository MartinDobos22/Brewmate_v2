import type { DatabaseConfig } from './databaseConfig.js';
import type { FirebaseCredentials } from './firebaseCredentials.js';
import type { LoggingConfig } from './loggingConfig.js';
import type { NodeEnvironment } from './nodeEnvironment.js';
import type { ServerConfig } from './serverConfig.js';

/** Fully validated, immutable application configuration. */
export interface AppConfig {
  readonly environment: NodeEnvironment;
  readonly server: ServerConfig;
  readonly database: DatabaseConfig;
  /** Null in the test environment, where a stub token verifier is used instead. */
  readonly firebase: FirebaseCredentials | null;
  readonly logging: LoggingConfig;
}
