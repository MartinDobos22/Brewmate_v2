import { reload, sendEmailVerification } from 'firebase/auth';

import { requireFirebaseUser } from './currentFirebaseUser';

const FORCE_TOKEN_REFRESH = true;

export const resendVerificationEmail = async (): Promise<void> => {
  await sendEmailVerification(requireFirebaseUser());
};

/**
 * Re-reads the account from Firebase and reports whether the address is
 * verified by now.
 *
 * The forced token refresh is what makes the answer visible to the rest of the
 * app: it republishes the ID token, which is how the session listener - and
 * the API on the next request - learn about the new state.
 */
export const refreshEmailVerification = async (): Promise<boolean> => {
  const user = requireFirebaseUser();

  await reload(user);
  await user.getIdToken(FORCE_TOKEN_REFRESH);

  return user.emailVerified;
};
