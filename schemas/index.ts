/**
 * Central export for all Zod schemas.
 * Import schemas from here for consistency.
 *
 * @example
 * ```ts
 * import { instrumentSchema, type Instrument } from '@/schemas';
 * ```
 */
export { instrumentListSchema, instrumentSchema, type Instrument } from './instrument';
export { userSchema, type User } from './user';
