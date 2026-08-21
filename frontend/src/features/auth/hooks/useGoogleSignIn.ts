import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';

import { readGoogleAuthConfig } from '../../../config';
import { TRANSLATION_KEYS } from '../../../i18n';
import { AUTH_SESSION_RESULTS, GOOGLE_ID_TOKEN_PARAM } from '../constants/firebaseAuthErrorCodes';
import { signInWithGoogleIdToken } from '../services/googleAuth';

import type { SocialSignIn } from './socialSignIn';
import { useAuthMutation } from './useAuthMutation';

/** Closes the browser tab left behind by a completed sign-in on web. */
WebBrowser.maybeCompleteAuthSession();

/**
 * Google Sign-In through the system browser: the app never sees the password,
 * only the ID token Google returns, which is then traded for a Firebase
 * session.
 *
 * Only ever mounted when the OAuth client IDs are configured - the request
 * builder rejects an unconfigured platform outright.
 */
export const useGoogleSignIn = (): SocialSignIn => {
  const config = readGoogleAuthConfig();
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: config.webClientId,
    webClientId: config.webClientId,
    iosClientId: config.iosClientId,
    androidClientId: config.androidClientId,
  });
  const [isPrompting, setIsPrompting] = useState(false);
  const [promptFailed, setPromptFailed] = useState(false);
  const { run, isPending, errorKey } = useAuthMutation(signInWithGoogleIdToken);

  useEffect((): void => {
    if (response === null) {
      return;
    }

    setIsPrompting(false);

    if (response.type === AUTH_SESSION_RESULTS.success) {
      const idToken = response.params[GOOGLE_ID_TOKEN_PARAM];

      if (idToken !== undefined) {
        run(idToken);
      }

      return;
    }

    // Closing the browser is a choice, not a failure worth reporting.
    setPromptFailed(response.type === AUTH_SESSION_RESULTS.error);
  }, [response, run]);

  const signIn = useCallback((): void => {
    setPromptFailed(false);
    setIsPrompting(true);
    void promptAsync().catch((): void => {
      setIsPrompting(false);
      setPromptFailed(true);
    });
  }, [promptAsync]);

  return {
    signIn,
    isPending: isPrompting || isPending,
    errorKey: promptFailed ? TRANSLATION_KEYS.authErrorUnknown : errorKey,
    ready: request !== null,
  };
};
