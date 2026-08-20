export interface DatabaseConfig {
  /** Connection used by the running application (pooled endpoint in production). */
  readonly url: string;
  /** Connection used by drizzle-kit and programmatic migrations (direct endpoint). */
  readonly migrationUrl: string;
  readonly maxConnections: number;
}
