import { QueryClient } from '@tanstack/react-query';

/**
 * Global QueryClient with sensible defaults for a mobile app.
 *
 * - staleTime: 5 minutes — data is considered fresh for 5 min after fetch
 * - gcTime: 30 minutes — unused cache entries garbage-collected after 30 min
 * - retry: 2 — retry failed requests twice before surfacing the error
 * - refetchOnWindowFocus: false — mobile apps don't have "window focus" in the same way
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
