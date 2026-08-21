import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import { getFirebaseAuth } from '../../../lib/firebase';

import { normalizeCredentials, type EmailCredentials } from './emailCredentials';

export const signInWithEmail = async (credentials: EmailCredentials): Promise<void> => {
  const { email, password } = normalizeCredentials(credentials);

  await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
};

/**
 * Creates the account and immediately sends the verification e-mail, so the
 * user only ever has to ask for it again if the first one got lost.
 *
 * Firebase signs the new account in as a side effect; the backend user row is
 * created by the first authenticated call to `/me`.
 */
export const signUpWithEmail = async (credentials: EmailCredentials): Promise<void> => {
  const { email, password } = normalizeCredentials(credentials);
  const { user } = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);

  await sendEmailVerification(user);
};
