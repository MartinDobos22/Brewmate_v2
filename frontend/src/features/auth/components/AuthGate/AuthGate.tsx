import * as SplashScreen from 'expo-splash-screen';
import { useEffect, type JSX, type ReactNode } from 'react';

import { AUTH_STATUS } from '../../constants/authStatus';
import { useAuthSession } from '../../context';
import { useCurrentUser, useProtectedRoute } from '../../hooks';

export interface AuthGateProps {
  readonly children: ReactNode;
}

/**
 * Holds the splash screen until Firebase has said who the user is, then lets
 * the navigator render and keeps the visible screen in step with the session.
 *
 * Mounting `useCurrentUser` here is what provisions the backend user: the
 * first authenticated request goes out as soon as anyone signs in, wherever
 * they happen to land.
 */
export const AuthGate = ({ children }: AuthGateProps): JSX.Element | null => {
  const { status } = useAuthSession();
  const isResolved = status !== AUTH_STATUS.loading;

  useProtectedRoute();
  useCurrentUser();

  useEffect((): void => {
    if (isResolved) {
      void SplashScreen.hideAsync();
    }
  }, [isResolved]);

  if (!isResolved) {
    return null;
  }

  return <>{children}</>;
};
