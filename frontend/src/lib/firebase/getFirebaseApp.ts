import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';

import { readFirebaseConfig } from '../../config';

let app: FirebaseApp | null = null;

/**
 * The app's single Firebase instance, built on first use. Lazy on purpose: a
 * missing EXPO_PUBLIC_FIREBASE_* variable should fail the screen that needs
 * Firebase, not the import graph of the whole app.
 */
export const getFirebaseApp = (): FirebaseApp => {
  app ??= getApps()[0] ?? initializeApp(readFirebaseConfig());

  return app;
};
