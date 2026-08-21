import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { getAuth, getReactNativePersistence, initializeAuth, type Auth } from 'firebase/auth';

import { getFirebaseApp } from './getFirebaseApp';

const WEB_PLATFORM = 'web';

let auth: Auth | null = null;

/**
 * Firebase Auth, wired to AsyncStorage so a session survives the app being
 * closed. Without an explicit persistence the React Native build keeps the
 * session in memory only and the user is signed out on every cold start.
 *
 * `getReactNativePersistence` exists only in the React Native bundle of
 * firebase/auth, so the web preview falls back to the browser default.
 */
export const getFirebaseAuth = (): Auth => {
  auth ??=
    Platform.OS === WEB_PLATFORM
      ? getAuth(getFirebaseApp())
      : initializeAuth(getFirebaseApp(), {
          persistence: getReactNativePersistence(AsyncStorage),
        });

  return auth;
};
