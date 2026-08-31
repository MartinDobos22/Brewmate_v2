import type { AiConfig } from './aiConfig.js';
import type { DatabaseConfig } from './databaseConfig.js';
import type { FirebaseCredentials } from './firebaseCredentials.js';
import type { LoggingConfig } from './loggingConfig.js';
import type { NodeEnvironment } from './nodeEnvironment.js';
import type { ServerConfig } from './serverConfig.js';
import type { TelemetryConfig } from './telemetryConfig.js';
import type { VisionConfig } from './visionConfig.js';

/** Fully validated, immutable application configuration. */
export interface AppConfig {
  readonly environment: NodeEnvironment;
  readonly server: ServerConfig;
  readonly database: DatabaseConfig;
  /** Null in the test environment, where a stub token verifier is used instead. */
  readonly firebase: FirebaseCredentials | null;
  /** Null wherever no model provider is configured; the AI routes then 503. */
  readonly ai: AiConfig | null;
  /**
   * Null wherever no optical reader is configured; a photographed label is
   * then read by the model alone, and nothing checks the picture first.
   */
  readonly vision: VisionConfig | null;
  /** Null wherever no DSN is configured; failures are then only logged. */
  readonly telemetry: TelemetryConfig | null;
  readonly logging: LoggingConfig;
}
