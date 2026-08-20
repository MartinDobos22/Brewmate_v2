import type { FastifyInstance } from 'fastify';

import { EXIT_CODE_FAILURE, GRACEFUL_SHUTDOWN_TIMEOUT_MS } from '../constants/serverDefaults.js';
import { LOG_MESSAGES } from '../logging/logMessages.js';

const SHUTDOWN_SIGNALS = ['SIGINT', 'SIGTERM'] as const;

/**
 * Stops accepting connections, drains in-flight requests and releases the
 * database pool. A hung shutdown is forced down after a fixed timeout.
 */
export const registerShutdownHandlers = (
  app: FastifyInstance,
  releaseResources: () => Promise<void>,
): void => {
  const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
    app.log.info({ signal }, LOG_MESSAGES.shutdownSignalReceived);

    const forceExit = setTimeout(() => {
      process.exit(EXIT_CODE_FAILURE);
    }, GRACEFUL_SHUTDOWN_TIMEOUT_MS);
    forceExit.unref();

    try {
      await app.close();
      await releaseResources();
      app.log.info(LOG_MESSAGES.shutdownComplete);
    } catch (error: unknown) {
      app.log.error({ err: error }, LOG_MESSAGES.shutdownFailed);
      process.exitCode = EXIT_CODE_FAILURE;
    } finally {
      clearTimeout(forceExit);
    }
  };

  for (const signal of SHUTDOWN_SIGNALS) {
    process.once(signal, (received: NodeJS.Signals) => {
      void shutdown(received);
    });
  }
};
