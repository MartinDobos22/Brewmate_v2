import { z } from 'zod';

import { DEFAULT_POOL_MAX_CONNECTIONS } from '../constants/databaseDefaults.js';
import { DEFAULT_HOST, DEFAULT_PORT, MAX_PORT, MIN_PORT } from '../constants/serverDefaults.js';
import { DEFAULT_LOG_LEVEL, LOG_LEVELS } from '../logging/logLevels.js';

import { CONFIG_ERROR_MESSAGES } from './configErrorMessages.js';
import { emptyAsUndefined } from './emptyEnvValue.js';
import { NODE_ENVIRONMENTS } from './nodeEnvironment.js';

/**
 * The complete set of environment variables the server reads.
 * Anything not listed here is invisible to the application.
 *
 * Every field goes through `emptyAsUndefined`, because a hosting dashboard
 * writes a variable it was given no value for as an empty string, and an empty
 * variable means the same thing as an absent one.
 */
export const envSchema = z
  .object({
    NODE_ENV: z.preprocess(
      emptyAsUndefined,
      z.enum(NODE_ENVIRONMENTS).default(NODE_ENVIRONMENTS.development),
    ),
    HOST: z.preprocess(emptyAsUndefined, z.string().min(1).default(DEFAULT_HOST)),
    PORT: z.preprocess(
      emptyAsUndefined,
      z.coerce.number().int().min(MIN_PORT).max(MAX_PORT).default(DEFAULT_PORT),
    ),
    LOG_LEVEL: z.preprocess(emptyAsUndefined, z.enum(LOG_LEVELS).default(DEFAULT_LOG_LEVEL)),

    DATABASE_URL: z.preprocess(emptyAsUndefined, z.url().optional()),
    DATABASE_URL_UNPOOLED: z.preprocess(emptyAsUndefined, z.url().optional()),
    TEST_DATABASE_URL: z.preprocess(emptyAsUndefined, z.url().optional()),
    DATABASE_POOL_MAX: z.preprocess(
      emptyAsUndefined,
      z.coerce.number().int().positive().default(DEFAULT_POOL_MAX_CONNECTIONS),
    ),

    FIREBASE_PROJECT_ID: z.preprocess(emptyAsUndefined, z.string().min(1).optional()),
    FIREBASE_CLIENT_EMAIL: z.preprocess(emptyAsUndefined, z.email().optional()),
    FIREBASE_PRIVATE_KEY: z.preprocess(emptyAsUndefined, z.string().min(1).optional()),

    /**
     * Optional everywhere. A build without it serves every screen that asks no
     * model anything, and answers the two AI routes with 503.
     */
    ANTHROPIC_API_KEY: z.preprocess(emptyAsUndefined, z.string().min(1).optional()),

    /**
     * Optional everywhere, and absent in every test run. Unset means errors
     * are logged and not reported anywhere else, which is a deployment choice
     * rather than a misconfiguration.
     */
    SENTRY_DSN: z.preprocess(emptyAsUndefined, z.string().min(1).optional()),
  })
  .superRefine((env, ctx) => {
    const isTest = env.NODE_ENV === NODE_ENVIRONMENTS.test;

    if (isTest && env.TEST_DATABASE_URL === undefined) {
      ctx.addIssue({
        code: 'custom',
        path: ['TEST_DATABASE_URL'],
        message: CONFIG_ERROR_MESSAGES.missingTestDatabaseUrl,
      });
    }

    if (!isTest && env.DATABASE_URL === undefined) {
      ctx.addIssue({
        code: 'custom',
        path: ['DATABASE_URL'],
        message: CONFIG_ERROR_MESSAGES.missingDatabaseUrl,
      });
    }

    const hasFirebaseCredentials =
      env.FIREBASE_PROJECT_ID !== undefined &&
      env.FIREBASE_CLIENT_EMAIL !== undefined &&
      env.FIREBASE_PRIVATE_KEY !== undefined;

    if (!isTest && !hasFirebaseCredentials) {
      ctx.addIssue({
        code: 'custom',
        path: ['FIREBASE_PROJECT_ID'],
        message: CONFIG_ERROR_MESSAGES.missingFirebaseCredentials,
      });
    }
  });

export type Env = z.infer<typeof envSchema>;
