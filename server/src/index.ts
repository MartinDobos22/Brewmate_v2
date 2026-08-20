import { pino } from 'pino';

import { buildApp } from './app/buildApp.js';
import { createAppDependencies } from './app/createAppDependencies.js';
import { registerShutdownHandlers } from './app/registerShutdownHandlers.js';
import { ENV_FILE_NAME } from './config/envFileNames.js';
import { loadConfig } from './config/loadConfig.js';
import { loadEnvFile } from './config/loadEnvFile.js';
import { EXIT_CODE_FAILURE } from './constants/serverDefaults.js';
import { LOG_MESSAGES } from './logging/logMessages.js';

const start = async (): Promise<void> => {
  loadEnvFile(ENV_FILE_NAME);

  const config = loadConfig();
  const runtime = createAppDependencies(config);
  const app = await buildApp(runtime.dependencies);

  registerShutdownHandlers(app, runtime.close);

  await app.listen({ host: config.server.host, port: config.server.port });

  app.log.info(
    { host: config.server.host, port: config.server.port, environment: config.environment },
    LOG_MESSAGES.serverListening,
  );
};

try {
  await start();
} catch (error: unknown) {
  pino().error({ err: error }, LOG_MESSAGES.serverStartFailed);
  process.exitCode = EXIT_CODE_FAILURE;
}
