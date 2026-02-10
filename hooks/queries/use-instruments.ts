import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { instrumentListSchema, type Instrument } from '@/schemas';

/**
 * Query key factory for instruments.
 * Follows TanStack Query best practices for key management.
 */
export const instrumentKeys = {
  all: ['instruments'] as const,
  lists: () => [...instrumentKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...instrumentKeys.lists(), filters ?? {}] as const,
  details: () => [...instrumentKeys.all, 'detail'] as const,
  detail: (id: number) => [...instrumentKeys.details(), id] as const,
};

/**
 * Fetch all instruments from Supabase with Zod runtime validation.
 */
async function fetchInstruments(): Promise<Instrument[]> {
  const { data, error } = await supabase.from('instruments').select();

  if (error) {
    throw new Error(`Failed to fetch instruments: ${error.message}`);
  }

  // Runtime type validation — ensures API data matches our schema
  return instrumentListSchema.parse(data);
}

/**
 * TanStack Query hook for fetching instruments.
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useInstruments();
 * ```
 */
export function useInstruments() {
  return useQuery({
    queryKey: instrumentKeys.lists(),
    queryFn: fetchInstruments,
  });
}
