import { z } from 'zod';

/**
 * Zod schema for user profile data.
 * Used for validating user data from Supabase.
 */
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().optional(),
  avatar_url: z.string().url().optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;
