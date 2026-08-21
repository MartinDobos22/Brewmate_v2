import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

import { getFirebaseAuth } from '../../../lib/firebase';

/**
 * Exchanges the ID token Google handed back for a Firebase session.
 *
 * The account is created on Google's side, so this same call covers both
 * "register with Google" and "sign in with Google".
 */
export const signInWithGoogleIdToken = async (idToken: string): Promise<void> => {
  await signInWithCredential(getFirebaseAuth(), GoogleAuthProvider.credential(idToken));
};
