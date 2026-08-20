export interface ServerConfig {
  readonly host: string;
  readonly port: number;
  readonly bodyLimitBytes: number;
}
