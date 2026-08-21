import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { OAuthProvider, signInWithCredential, updateProfile } from 'firebase/auth';

import { getFirebaseAuth } from '../../../lib/firebase';
import { AUTH_PROVIDER_IDS } from '../constants/authProviderIds';
import { APPLE_CANCELLED_ERROR_CODE } from '../constants/firebaseAuthErrorCodes';

import { readErrorCode } from './readErrorCode';
import { toAppleDisplayName } from './appleDisplayName';

const MISSING_IDENTITY_TOKEN_MESSAGE = 'Apple returned no identity token.';

const REQUESTED_SCOPES = [
  AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
  AppleAuthentication.AppleAuthenticationScope.EMAIL,
];

/**
 * Signs in with Apple.
 *
 * The nonce is generated here, handed to Apple as a SHA-256 digest and to
 * Firebase in the clear: Firebase hashes it again and compares, which is what
 * proves the identity token was minted for this very request and cannot be
 * replayed.
 *
 * Backing out of Apple's sheet is not a failure - it resolves quietly, so the
 * screen shows no error for something the user chose to do.
 */
export const signInWithApple = async (): Promise<void> => {
  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);

  let credential: AppleAuthentication.AppleAuthenticationCredential;

  try {
    credential = await AppleAuthentication.signInAsync({
      requestedScopes: REQUESTED_SCOPES,
      nonce: hashedNonce,
    });
  } catch (error: unknown) {
    if (readErrorCode(error) === APPLE_CANCELLED_ERROR_CODE) {
      return;
    }

    throw error;
  }

  const { identityToken } = credential;

  if (identityToken === null) {
    throw new Error(MISSING_IDENTITY_TOKEN_MESSAGE);
  }

  const appleCredential = new OAuthProvider(AUTH_PROVIDER_IDS.apple).credential({
    idToken: identityToken,
    rawNonce,
  });
  const { user } = await signInWithCredential(getFirebaseAuth(), appleCredential);
  const displayName = toAppleDisplayName(credential.fullName);

  if (displayName !== null && user.displayName === null) {
    await updateProfile(user, { displayName });
  }
};
