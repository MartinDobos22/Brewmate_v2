import { pino } from 'pino';

import { ENV_FILE_NAME } from '../../config/envFileNames.js';
import { loadConfig } from '../../config/loadConfig.js';
import { loadEnvFile } from '../../config/loadEnvFile.js';
import { EXIT_CODE_FAILURE } from '../../constants/serverDefaults.js';
import { LOG_MESSAGES } from '../../logging/logMessages.js';
import { createCoffeeTasteReadingRepository } from '../../modules/ai/coffeeTasteEstimate/coffeeTasteReadingRepository.js';
import {
  backfillPurchases,
  createPurchaseBackfillRepository,
} from '../../modules/bagRatings/index.js';
import { createTasteProfileEventRepository } from '../../modules/tasteProfiles/tasteProfileEventRepository.js';
import { createTasteProfileRepository } from '../../modules/tasteProfiles/tasteProfileRepository.js';
import { createTasteProfileService } from '../../modules/tasteProfiles/tasteProfileService.js';
import { createDatabase } from '../createDatabase.js';

const logger = pino();

/**
 * Run once, after the migration that shipped purchase learning.
 *
 * A release step rather than something the server does on boot, for the
 * reason migrations are: two instances starting together would both walk the
 * whole cupboard. Idempotent, so running it again on a later deploy costs a
 * read and records nothing.
 */
const main = async (): Promise<void> => {
  loadEnvFile(ENV_FILE_NAME);

  const config = loadConfig();
  const connection = createDatabase(config.database.url, config.database.maxConnections);
  const eventRepository = createTasteProfileEventRepository(connection.db);

  logger.info(LOG_MESSAGES.purchaseBackfillStarted);

  try {
    const summary = await backfillPurchases({
      repository: createPurchaseBackfillRepository(connection.db),
      eventRepository,
      readings: createCoffeeTasteReadingRepository(connection.db),
      tasteProfileService: createTasteProfileService(
        createTasteProfileRepository(connection.db),
        eventRepository,
      ),
    });

    logger.info(summary, LOG_MESSAGES.purchaseBackfillComplete);
  } finally {
    await connection.close();
  }
};

try {
  await main();
} catch (error: unknown) {
  logger.error({ error }, LOG_MESSAGES.purchaseBackfillFailed);
  process.exitCode = EXIT_CODE_FAILURE;
}
