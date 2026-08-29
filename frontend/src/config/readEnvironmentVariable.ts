/**
 * Expo inlines EXPO_PUBLIC_* variables at build time. Typed locally because the
 * app bundle has no Node type definitions.
 */
declare const process: { readonly env: Readonly<Record<string, string | undefined>> };

/**
 * Reads one variable, treating an empty one as absent.
 *
 * `.env` lists every optional variable with nothing after the `=`, so
 * that somebody can see what a build could carry - and Expo inlines that as an
 * empty string rather than leaving it out. Without this, a checkout that has
 * not been given a storage bucket would report photo scanning as configured,
 * offer the camera, and fail at the upload in a shop.
 */
export const readEnvironmentVariable = (key: string): string | undefined => {
  const value = process.env[key];

  return value === undefined || value === '' ? undefined : value;
};
