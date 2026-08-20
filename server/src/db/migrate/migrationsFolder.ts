import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Directory holding the generated SQL migrations, relative to the package root. */
export const MIGRATIONS_DIRECTORY_NAME = 'drizzle';

const PACKAGE_ROOT_FROM_HERE = '../../..';

/**
 * Resolves the migrations folder for both `src` (tsx) and `dist` (node) layouts,
 * which sit at the same depth below the package root.
 */
export const resolveMigrationsFolder = (): string =>
  resolve(
    dirname(fileURLToPath(import.meta.url)),
    PACKAGE_ROOT_FROM_HERE,
    MIGRATIONS_DIRECTORY_NAME,
  );
