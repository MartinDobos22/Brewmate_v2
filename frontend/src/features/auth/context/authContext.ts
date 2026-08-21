import { createContext } from 'react';

import { LOADING_SESSION, type AuthSession } from './authSession';

/**
 * Defaults to the loading session, so a component rendered outside the
 * provider waits rather than claiming nobody is signed in.
 */
export const AuthContext = createContext<AuthSession>(LOADING_SESSION);
