/**
 * Expo inlines EXPO_PUBLIC_* variables at build time. Typed locally because the
 * app bundle has no Node type definitions.
 */
declare const process: { readonly env: Readonly<Record<string, string | undefined>> };

export const readEnvironmentVariable = (key: string): string | undefined => process.env[key];
