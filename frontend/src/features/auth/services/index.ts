export { fetchCurrentUser, updateCurrentUser, requestAccountDeletion } from './accountApi';
export { signInWithApple } from './appleAuth';
export { toAppleDisplayName } from './appleDisplayName';
export { AUTH_ERROR_KEYS, API_ERROR_KEYS } from './authErrorKeys';
export { hasPasswordProvider, requireFirebaseUser } from './currentFirebaseUser';
export {
  hasCredentialError,
  normalizeCredentials,
  validateCredentials,
  validateEmailAddress,
} from './emailCredentials';
export type { CredentialErrors, EmailCredentials } from './emailCredentials';
export { signInWithEmail, signUpWithEmail } from './emailPasswordAuth';
export { refreshEmailVerification, resendVerificationEmail } from './emailVerification';
export { signInWithGoogleIdToken } from './googleAuth';
export { sendPasswordReset } from './passwordReset';
export { readErrorCode } from './readErrorCode';
export { resolveAuthErrorKey } from './resolveAuthErrorKey';
export { deleteAccount, signOutFromFirebase } from './sessionActions';
