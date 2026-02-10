import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from '@/lib/storage';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthState {
  /** Whether the user is currently authenticated */
  isAuthenticated: boolean;
  /** The current user's ID (from Supabase auth) */
  userId: string | null;
  /** The current user's email */
  email: string | null;
  /** Whether auth state has been loaded from storage */
  isHydrated: boolean;
}

interface AuthActions {
  /** Set user session data after login */
  setSession: (userId: string, email: string) => void;
  /** Clear session data on logout */
  clearSession: () => void;
  /** Mark store as hydrated from persisted storage */
  setHydrated: () => void;
}

type AuthStore = AuthState & AuthActions;

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      isAuthenticated: false,
      userId: null,
      email: null,
      isHydrated: false,

      // Actions
      setSession: (userId, email) =>
        set({
          isAuthenticated: true,
          userId,
          email,
        }),

      clearSession: () =>
        set({
          isAuthenticated: false,
          userId: null,
          email: null,
        }),

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => zustandStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userId: state.userId,
        email: state.email,
      }),
    },
  ),
);
