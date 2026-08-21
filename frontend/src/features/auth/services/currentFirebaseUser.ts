import type { User as FirebaseUser } from 'firebase/auth';

import { getFirebaseAuth } from '../../../lib/firebase';
import { AUTH_PROVIDER_IDS } from '../constants/authProviderIds';

const NO_SESSION_MESSAGE = 'No Firebase user is signed in.';

/**
 * The signed-in Firebase user.
 *
 * @throws Error when called with nobody signed in. Every caller runs behind the
 * auth gate, so this is a programming error rather than something to render.
 */
export const requireFirebaseUser = (): FirebaseUser => {
  const { currentUser } = getFirebaseAuth();

  if (currentUser === null) {
    throw new Error(NO_SESSION_MESSAGE);
  }

  return currentUser;
};

/** True when the account can sign in with a password, so verification applies. */
export const hasPasswordProvider = (user: FirebaseUser): boolean =>
  user.providerData.some((provider) => provider.providerId === AUTH_PROVIDER_IDS.password);
