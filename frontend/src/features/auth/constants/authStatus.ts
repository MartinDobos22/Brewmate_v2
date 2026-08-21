/** Where the app is in resolving who the user is. */
export const AUTH_STATUS = {
  /** Firebase has not answered yet - the splash screen is still up. */
  loading: 'loading',
  authenticated: 'authenticated',
  unauthenticated: 'unauthenticated',
} as const;

export type AuthStatus = (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS];
