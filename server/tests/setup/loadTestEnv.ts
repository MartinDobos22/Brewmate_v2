import { ENV_FILE_NAME, TEST_ENV_FILE_NAME } from '../../src/config/envFileNames.js';
import { loadEnvFile } from '../../src/config/loadEnvFile.js';
import { NODE_ENVIRONMENTS } from '../../src/config/nodeEnvironment.js';

const NODE_ENV_KEY = 'NODE_ENV';

/**
 * Tests always run against the dedicated Neon test branch: NODE_ENV is forced
 * to `test`, which makes the config resolver pick TEST_DATABASE_URL.
 */
export const loadTestEnv = (): void => {
  loadEnvFile(TEST_ENV_FILE_NAME);
  loadEnvFile(ENV_FILE_NAME);

  process.env[NODE_ENV_KEY] = NODE_ENVIRONMENTS.test;
};

loadTestEnv();
