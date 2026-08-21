import { ENVIRONMENT_KEYS } from './environmentKeys';
import { requireEnvironmentVariable } from './requireEnvironmentVariable';

/** The public Firebase client configuration. See ENVIRONMENT_KEYS for why it is public. */
export interface FirebaseConfig {
  readonly apiKey: string;
  readonly authDomain: string;
  readonly projectId: string;
  readonly appId: string;
}

export const readFirebaseConfig = (): FirebaseConfig => ({
  apiKey: requireEnvironmentVariable(ENVIRONMENT_KEYS.firebaseApiKey),
  authDomain: requireEnvironmentVariable(ENVIRONMENT_KEYS.firebaseAuthDomain),
  projectId: requireEnvironmentVariable(ENVIRONMENT_KEYS.firebaseProjectId),
  appId: requireEnvironmentVariable(ENVIRONMENT_KEYS.firebaseAppId),
});
