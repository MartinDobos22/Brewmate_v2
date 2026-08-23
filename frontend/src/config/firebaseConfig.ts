import { ENVIRONMENT_KEYS } from './environmentKeys';
import { requireEnvironmentVariable } from './requireEnvironmentVariable';
import { readStorageBucket } from './storageConfig';

/** The public Firebase client configuration. See ENVIRONMENT_KEYS for why it is public. */
export interface FirebaseConfig {
  readonly apiKey: string;
  readonly authDomain: string;
  readonly projectId: string;
  readonly appId: string;
  /** Undefined in a build that does not offer photo scanning. */
  readonly storageBucket: string | undefined;
}

export const readFirebaseConfig = (): FirebaseConfig => ({
  apiKey: requireEnvironmentVariable(ENVIRONMENT_KEYS.firebaseApiKey),
  authDomain: requireEnvironmentVariable(ENVIRONMENT_KEYS.firebaseAuthDomain),
  projectId: requireEnvironmentVariable(ENVIRONMENT_KEYS.firebaseProjectId),
  appId: requireEnvironmentVariable(ENVIRONMENT_KEYS.firebaseAppId),
  storageBucket: readStorageBucket(),
});
