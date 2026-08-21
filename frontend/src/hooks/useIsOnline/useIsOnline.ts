import { useNetworkState } from 'expo-network';

/**
 * Whether the device can reach the network right now.
 *
 * Both fields are optional and start out undefined, which is treated as online
 * on purpose: a screen must never block sign-in because the first probe has
 * not answered yet. Only an explicit `false` counts as offline.
 */
export const useIsOnline = (): boolean => {
  const { isConnected, isInternetReachable } = useNetworkState();

  return isConnected !== false && isInternetReachable !== false;
};
