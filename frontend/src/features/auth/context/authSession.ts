import type { User as FirebaseUser } from 'firebase/auth';

import { AUTH_STATUS, type AuthStatus } from '../constants/authStatus';
import { hasPasswordProvider } from '../services/currentFirebaseUser';

/** Who the user is, as far as the app currently knows. */
export interface AuthSession {
  readonly status: AuthStatus;
  readonly user: FirebaseUser | null;
  /**
   * True for a password account whose address has not been confirmed yet.
   * Accounts from Google and Apple arrive verified, so they never see the
   * verification screen.
   */
  readonly needsEmailVerification: boolean;
}

export const LOADING_SESSION: AuthSession = {
  status: AUTH_STATUS.loading,
  user: null,
  needsEmailVerification: false,
};

/** A new object every time, so React re-renders when the token changes. */
export const toAuthSession = (user: FirebaseUser | null): AuthSession => {
  if (user === null) {
    return { status: AUTH_STATUS.unauthenticated, user: null, needsEmailVerification: false };
  }

  return {
    status: AUTH_STATUS.authenticated,
    user,
    needsEmailVerification: hasPasswordProvider(user) && !user.emailVerified,
  };
};
