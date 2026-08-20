import { pino } from 'pino';

import { ENV_FILE_NAME } from '../../config/envFileNames.js';
import { loadConfig } from '../../config/loadConfig.js';
import { loadEnvFile } from '../../config/loadEnvFile.js';
import { EXIT_CODE_FAILURE } from '../../constants/serverDefaults.js';
import { LOG_MESSAGES } from '../../logging/logMessages.js';

import { runMigrations } from './runMigrations.js';

const logger = pino();

const main = async (): Promise<void> => {
  loadEnvFile(ENV_FILE_NAME);

  const config = loadConfig();

  logger.info(LOG_MESSAGES.migrationsStarted);
  await runMigrations(config.database.migrationUrl);
  logger.info(LOG_MESSAGES.migrationsComplete);
};

try {
  await main();
} catch (error: unknown) {
  logger.error({ error }, LOG_MESSAGES.migrationsFailed);
  process.exitCode = EXIT_CODE_FAILURE;
}
