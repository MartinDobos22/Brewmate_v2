/**
 * The Firebase Storage error codes the app tells apart.
 *
 * Two lists rather than one, because they ask for opposite things from the
 * person holding the phone. The first is a connection that gave out: the bytes
 * are fine, the bucket is fine, and walking a few steps is a real fix. The
 * second is this application being wrong about its own bucket - no rules, no
 * bucket, no signed-in caller, no quota - and none of that gets better by
 * trying again in a shop.
 *
 * Anything not listed falls in with the second, `storage/unknown` included.
 * The upload already tries three times with a doubling wait before an error
 * reaches anybody, and a dead spot that survives all three reports itself as
 * `retry-limit-exceeded`; an unknown on first contact is a project that was
 * never set up, and telling somebody to go and stand somewhere else about it
 * would waste their afternoon on our mistake.
 */
export const STORAGE_RETRYABLE_ERROR_CODES = [
  'storage/retry-limit-exceeded',
  'storage/canceled',
] as const;

export const STORAGE_REFUSED_ERROR_CODES = [
  'storage/unauthorized',
  'storage/unauthenticated',
  'storage/unauthorized-app',
  'storage/bucket-not-found',
  'storage/project-not-found',
  'storage/quota-exceeded',
  'storage/invalid-default-bucket',
  'storage/no-default-bucket',
  'storage/unsupported-environment',
] as const;
