/**
 * Credentials for the model provider.
 *
 * The API key lives here and only here. It never reaches the app: everything
 * in an Expo bundle is readable by anybody who installs it, which is why every
 * model call in Brewmate goes through this server.
 */
export interface AiConfig {
  readonly anthropicApiKey: string;
}
