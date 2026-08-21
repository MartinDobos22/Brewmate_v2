import { useContext } from 'react';

import { AuthContext } from './authContext';
import type { AuthSession } from './authSession';

/** The single way a component asks who is signed in. */
export const useAuthSession = (): AuthSession => useContext(AuthContext);
