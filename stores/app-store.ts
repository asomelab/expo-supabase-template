import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from '@/lib/storage';

// ─── Types ────────────────────────────────────────────────────────────────────

type ThemeMode = 'light' | 'dark' | 'system';

interface AppState {
  /** User's preferred theme mode */
  themeMode: ThemeMode;
  /** Whether the user has completed onboarding */
  hasCompletedOnboarding: boolean;
}

interface AppActions {
  /** Set the theme mode preference */
  setThemeMode: (mode: ThemeMode) => void;
  /** Mark onboarding as completed */
  completeOnboarding: () => void;
  /** Reset all app state (e.g., on logout) */
  resetApp: () => void;
}

type AppStore = AppState & AppActions;

const initialState: AppState = {
  themeMode: 'system',
  hasCompletedOnboarding: false,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...initialState,

      setThemeMode: (mode) => set({ themeMode: mode }),

      completeOnboarding: () => set({ hasCompletedOnboarding: true }),

      resetApp: () => set(initialState),
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
