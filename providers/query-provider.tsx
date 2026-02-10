import { focusManager, onlineManager, QueryClientProvider } from '@tanstack/react-query';
import * as Network from 'expo-network';
import { useEffect, type ReactNode } from 'react';
import { AppState, Platform, type AppStateStatus } from 'react-native';

import { queryClient } from '@/lib/query-client';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // ─── Online Status Management ───────────────────────────────────────────────
  // Automatically refetch queries when the device regains network connectivity.
  useEffect(() => {
    const subscription = Network.addNetworkStateListener((state) => {
      onlineManager.setOnline(!!state.isConnected);
    });
    return () => subscription.remove();
  }, []);

  // ─── App Focus Refetching ───────────────────────────────────────────────────
  // Refetch stale queries when the app returns to the foreground.
  useEffect(() => {
    if (Platform.OS === 'web') return;

    const subscription = AppState.addEventListener('change', (status: AppStateStatus) => {
      focusManager.setFocused(status === 'active');
    });
    return () => subscription.remove();
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
