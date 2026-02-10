import { z } from 'zod';

/**
 * Zod schema for financial instruments.
 * Single source of truth — the TypeScript type is inferred from this schema.
 */
export const instrumentSchema = z.object({
  id: z.number(),
  name: z.string(),
  symbol: z.string().optional(),
  type: z.enum(['stock', 'bond', 'etf', 'crypto', 'mutual-fund', 'other']).optional(),
  currency: z.string().default('USD'),
  created_at: z.string().optional(),
});

/** Array schema for parsing lists of instruments */
export const instrumentListSchema = z.array(instrumentSchema);

/** TypeScript type inferred from the Zod schema */
export type Instrument = z.infer<typeof instrumentSchema>;
