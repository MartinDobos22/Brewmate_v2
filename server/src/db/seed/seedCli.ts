import { pino } from 'pino';

import { ENV_FILE_NAME } from '../../config/envFileNames.js';
import { loadConfig } from '../../config/loadConfig.js';
import { loadEnvFile } from '../../config/loadEnvFile.js';
import { EXIT_CODE_FAILURE } from '../../constants/serverDefaults.js';
import { LOG_MESSAGES } from '../../logging/logMessages.js';
import { createDatabase } from '../createDatabase.js';

import { runSeed } from './runSeed.js';

const logger = pino();

const main = async (): Promise<void> => {
  loadEnvFile(ENV_FILE_NAME);

  const config = loadConfig();
  const connection = createDatabase(config.database.url, config.database.maxConnections);

  logger.info(LOG_MESSAGES.seedStarted);

  try {
    logger.info(await runSeed(connection.db), LOG_MESSAGES.seedComplete);
  } finally {
    await connection.close();
  }
};

try {
  await main();
} catch (error: unknown) {
  logger.error({ error }, LOG_MESSAGES.seedFailed);
  process.exitCode = EXIT_CODE_FAILURE;
}
