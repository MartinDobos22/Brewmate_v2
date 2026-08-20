import type { DatabaseConfig } from './databaseConfig.js';
import { CONFIG_ERROR_MESSAGES } from './configErrorMessages.js';
import type { Env } from './envSchema.js';
import { NODE_ENVIRONMENTS } from './nodeEnvironment.js';

/**
 * Tests run against their own Neon branch; every other environment uses the
 * development/production branch. The unpooled endpoint is preferred for
 * migrations because drizzle-kit needs a plain session connection.
 */
export const resolveDatabaseConfig = (env: Env): DatabaseConfig => {
  const isTest = env.NODE_ENV === NODE_ENVIRONMENTS.test;
  const url = isTest ? env.TEST_DATABASE_URL : env.DATABASE_URL;

  if (url === undefined) {
    throw new Error(
      isTest
        ? CONFIG_ERROR_MESSAGES.missingTestDatabaseUrl
        : CONFIG_ERROR_MESSAGES.missingDatabaseUrl,
    );
  }

  return {
    url,
    migrationUrl: isTest ? url : (env.DATABASE_URL_UNPOOLED ?? url),
    maxConnections: env.DATABASE_POOL_MAX,
  };
};
