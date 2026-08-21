import { FirebaseError } from 'firebase/app';
import { sendPasswordResetEmail } from 'firebase/auth';

import { FIREBASE_AUTH_ERROR_CODES } from '../constants/firebaseAuthErrorCodes';
import { getFirebaseAuth } from '../../../lib/firebase';

/**
 * Sends the password reset link.
 *
 * An address with no account behind it is treated as success: the screen says
 * "if an account exists, the link is on its way", and answering differently
 * would turn the form into a way of finding out who is registered.
 */
export const sendPasswordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(getFirebaseAuth(), email.trim());
  } catch (error: unknown) {
    const isUnknownAddress =
      error instanceof FirebaseError && error.code === FIREBASE_AUTH_ERROR_CODES.userNotFound;

    if (!isUnknownAddress) {
      throw error;
    }
  }
};
