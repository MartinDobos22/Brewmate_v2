import { defineConfig } from 'vitest/config';

/**
 * The contract package's own test run.
 *
 * Unit tests only, and there is nothing here to mock: everything under test is
 * a pure function over plain values. That is the whole reason the conversion
 * lives in `shared` rather than in the API - arithmetic this important should
 * be testable without a database, a model or a server.
 */
export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
