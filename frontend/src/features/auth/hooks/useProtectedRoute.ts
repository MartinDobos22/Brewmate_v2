import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

import { AUTH_GROUP_SEGMENT, ROUTES } from '../../../constants';
import { AUTH_STATUS } from '../constants/authStatus';
import { useAuthSession } from '../context/useAuthSession';

const FIRST_SEGMENT = 0;

/**
 * Keeps the visible screen and the session in step: a signed-out visitor is
 * sent to the sign-in screen from anywhere in the app, and someone who has
 * just signed in is taken out of the sign-in screens - to the verification
 * notice when their address is still unconfirmed, otherwise straight home.
 */
export const useProtectedRoute = (): void => {
  const { status, needsEmailVerification } = useAuthSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect((): void => {
    if (status === AUTH_STATUS.loading) {
      return;
    }

    const inAuthGroup = segments[FIRST_SEGMENT] === AUTH_GROUP_SEGMENT;

    if (status === AUTH_STATUS.unauthenticated && !inAuthGroup) {
      router.replace(ROUTES.signIn);

      return;
    }

    if (status === AUTH_STATUS.authenticated && inAuthGroup) {
      router.replace(needsEmailVerification ? ROUTES.verifyEmail : ROUTES.home);
    }
  }, [status, needsEmailVerification, segments, router]);
};
