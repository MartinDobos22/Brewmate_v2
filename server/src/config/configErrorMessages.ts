/** Messages surfaced when the process is misconfigured. Fail loudly, fail early. */
export const CONFIG_ERROR_MESSAGES = {
  invalidEnvironment: 'Invalid environment configuration',
  missingDatabaseUrl: 'DATABASE_URL is required unless NODE_ENV=test.',
  missingTestDatabaseUrl:
    'TEST_DATABASE_URL is required when NODE_ENV=test. Point it at a dedicated Neon branch - tests truncate every table they touch.',
  missingFirebaseCredentials:
    'FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY are required outside the test environment.',
  aiCredentialsUnavailable:
    'ANTHROPIC_API_KEY is not configured; coffee bag scanning is unavailable in this deployment.',
  firebaseCredentialsUnavailable:
    'Firebase credentials are not configured; the Firebase token verifier cannot be created.',
} as const;
