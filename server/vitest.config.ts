import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

/** Hosted database round-trips are slower than a local socket. */
const TEST_TIMEOUT_MS = 30000;
const HOOK_TIMEOUT_MS = 60000;

const SHARED_PACKAGE_NAME = '@brewmate/shared';
const SHARED_ENTRY = '../shared/src/index.ts';

export default defineConfig({
  resolve: {
    alias: {
      // Type-check and run against the shared sources so tests never depend
      // on a stale build of @brewmate/shared.
      [SHARED_PACKAGE_NAME]: fileURLToPath(new URL(SHARED_ENTRY, import.meta.url)),
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    globalSetup: ['./tests/setup/globalSetup.ts'],
    setupFiles: ['./tests/setup/loadTestEnv.ts'],
    // Every test file shares one hosted database branch, so they must not
    // truncate tables underneath each other.
    fileParallelism: false,
    testTimeout: TEST_TIMEOUT_MS,
    hookTimeout: HOOK_TIMEOUT_MS,
  },
});
