import { onIdTokenChanged, type User as FirebaseUser } from 'firebase/auth';
import { useEffect, useState, type JSX, type ReactNode } from 'react';

import { getFirebaseAuth } from '../../../lib/firebase';

import { AuthContext } from './authContext';
import { LOADING_SESSION, toAuthSession, type AuthSession } from './authSession';

export interface AuthProviderProps {
  readonly children: ReactNode;
}

/**
 * Publishes the Firebase session to the whole app.
 *
 * `onIdTokenChanged` rather than `onAuthStateChanged`: it fires on sign-in and
 * sign-out *and* every time the ID token is renewed, which is what keeps a
 * refreshed session - and a freshly verified e-mail - visible to the UI.
 */
export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [session, setSession] = useState<AuthSession>(LOADING_SESSION);

  useEffect(
    (): (() => void) =>
      onIdTokenChanged(getFirebaseAuth(), (user: FirebaseUser | null): void => {
        setSession(toAuthSession(user));
      }),
    [],
  );

  return <AuthContext.Provider value={session}>{children}</AuthContext.Provider>;
};
