import { type App, cert, getApps, initializeApp } from 'firebase-admin/app';

import type { FirebaseCredentials } from '../config/firebaseCredentials.js';

/** Named so repeated initialisation inside one process is idempotent. */
const FIREBASE_APP_NAME = 'brewmate-api';

export const createFirebaseApp = (credentials: FirebaseCredentials): App => {
  const existing = getApps().find((app) => app.name === FIREBASE_APP_NAME);

  if (existing !== undefined) {
    return existing;
  }

  return initializeApp(
    {
      credential: cert({
        projectId: credentials.projectId,
        clientEmail: credentials.clientEmail,
        privateKey: credentials.privateKey,
      }),
      projectId: credentials.projectId,
    },
    FIREBASE_APP_NAME,
  );
};
