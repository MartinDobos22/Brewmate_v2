import { signOut } from 'firebase/auth';

import { getFirebaseAuth } from '../../../lib/firebase';

import { requestAccountDeletion } from './accountApi';

/** Ends the session on the device. The server keeps the account. */
export const signOutFromFirebase = async (): Promise<void> => {
  await signOut(getFirebaseAuth());
};

/**
 * Deletes the account for good.
 *
 * The API is called while the session is still valid - it needs the ID token -
 * and it removes both the stored data and the Firebase identity. Signing out
 * afterwards is what returns the app to the sign-in screen.
 */
export const deleteAccount = async (): Promise<void> => {
  await requestAccountDeletion();
  await signOutFromFirebase();
};
