import * as AppleAuthentication from 'expo-apple-authentication';
import { useEffect, useState } from 'react';

import { signInWithApple } from '../services/appleAuth';

import type { SocialSignIn } from './socialSignIn';
import { useAuthAction } from './useAuthAction';

/**
 * Sign in with Apple. Mandatory next to Google: Apple rejects an app that
 * offers a third-party social login without offering theirs.
 *
 * `isAvailableAsync` is false on Android and on iOS versions without the
 * feature, and the button is left out entirely in that case.
 */
export const useAppleSignIn = (): SocialSignIn => {
  const [isAvailable, setIsAvailable] = useState(false);
  const { run: signIn, isPending, errorKey } = useAuthAction(signInWithApple);

  useEffect((): void => {
    void AppleAuthentication.isAvailableAsync().then(setIsAvailable);
  }, []);

  return { signIn, isPending, errorKey, ready: isAvailable };
};
