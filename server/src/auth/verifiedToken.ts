/** The subset of a verified Firebase ID token the application cares about. */
export interface VerifiedToken {
  readonly firebaseUid: string;
  readonly email: string | null;
}
