import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { useMemo, type JSX, type ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LIMITS } from '../../../constants/limits';
import { createAppPersister, createAppQueryClient } from '../../../lib/queryClient';
import { ThemeProvider } from '../../../theme';

import { AnalyticsSync } from './AnalyticsSync';
import { PendingBrewLogSync } from './PendingBrewLogSync';

export interface AppProvidersProps {
  readonly children: ReactNode;
}

/**
 * Everything the whole app needs, wired once: safe areas, the persisted query
 * cache and the theme. UI state lives in the Zustand store, which needs no
 * provider.
 */
export const AppProviders = ({ children }: AppProvidersProps): JSX.Element => {
  const queryClient = useMemo(createAppQueryClient, []);
  const persister = useMemo(createAppPersister, []);

  return (
    <SafeAreaProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister, maxAge: LIMITS.persistMaxAgeMs }}
      >
        <ThemeProvider>
          <PendingBrewLogSync>
            <AnalyticsSync>{children}</AnalyticsSync>
          </PendingBrewLogSync>
        </ThemeProvider>
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  );
};
