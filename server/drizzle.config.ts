import { existsSync } from 'node:fs';

import { defineConfig } from 'drizzle-kit';

/**
 * drizzle-kit runs outside the application runtime, so it reads the environment
 * directly instead of going through the validated AppConfig.
 * Migrations are applied by `pnpm db:migrate` (see src/db/migrate).
 */
const ENV_FILE_NAME = '.env';
const SCHEMA_GLOB = './src/db/schema/*.ts';
const MIGRATIONS_OUT = './drizzle';
const POSTGRES_DIALECT = 'postgresql';
const MISSING_URL_MESSAGE =
  'Set DATABASE_URL (or DATABASE_URL_UNPOOLED) before running drizzle-kit.';

if (existsSync(ENV_FILE_NAME)) {
  process.loadEnvFile(ENV_FILE_NAME);
}

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (url === undefined) {
  throw new Error(MISSING_URL_MESSAGE);
}

export default defineConfig({
  schema: SCHEMA_GLOB,
  out: MIGRATIONS_OUT,
  dialect: POSTGRES_DIALECT,
  strict: true,
  verbose: true,
  dbCredentials: { url },
});
