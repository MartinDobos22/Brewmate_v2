/**
 * Removes an identity from the identity provider.
 *
 * Separate from `TokenVerifier` because deleting an account is the one thing
 * the API does *to* Firebase rather than *with* it, and because integration
 * tests must be able to observe the deletion without a live project.
 */
export interface IdentityDeleter {
  /** Deleting an identity that is already gone is a success, not an error. */
  deleteUser(firebaseUid: string): Promise<void>;
}
