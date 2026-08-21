/** Reads the `code` property SDK errors carry, when there is one. */
export const readErrorCode = (error: unknown): string | null => {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return null;
  }

  const { code } = error;

  return typeof code === 'string' ? code : null;
};
