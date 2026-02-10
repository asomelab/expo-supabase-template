import Constants from 'expo-constants';

/**
 * Minimal storage interface matching the subset of MMKV we use.
 * Allows swapping between MMKV (dev builds) and an in-memory Map (Expo Go).
 */
interface StorageAdapter {
  getString(key: string): string | undefined;
  set(key: string, value: string | number | boolean): void;
  remove(key: string): boolean;
}

/**
 * In-memory fallback used when running inside Expo Go,
 * where NitroModules (required by MMKV v4) are unavailable.
 * Data does NOT persist across app restarts in this mode.
 */
class InMemoryStorage implements StorageAdapter {
  private store = new Map<string, string>();

  getString(key: string): string | undefined {
    return this.store.get(key);
  }

  set(key: string, value: string | number | boolean): void {
    this.store.set(key, String(value));
  }

  remove(key: string): boolean {
    return this.store.delete(key);
  }
}

const isExpoGo = Constants.appOwnership === 'expo';

function createStorage(): StorageAdapter {
  if (isExpoGo) {
    if (__DEV__) {
      console.warn(
        '[storage] Running in Expo Go — using in-memory storage (data will not persist)',
      );
    }
    return new InMemoryStorage();
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createMMKV } = require('react-native-mmkv') as typeof import('react-native-mmkv');
  return createMMKV({ id: 'lasu-financial-storage' });
}

/**
 * Main storage instance for the app.
 * Uses MMKV in development/production builds, in-memory fallback in Expo Go.
 *
 * @see https://github.com/mrousavy/react-native-mmkv
 */
export const storage: StorageAdapter = createStorage();

/**
 * Zustand-compatible storage adapter for persist middleware.
 *
 * @example
 * ```ts
 * import { zustandStorage } from '@/lib/storage';
 * const useStore = create(persist(stateCreator, { storage: zustandStorage }));
 * ```
 */
export const zustandStorage = {
  getItem: (key: string): string | null => {
    const value = storage.getString(key);
    return value ?? null;
  },
  setItem: (key: string, value: string): void => {
    storage.set(key, value);
  },
  removeItem: (key: string): void => {
    storage.remove(key);
  },
};

/**
 * Supabase-compatible storage adapter.
 * Implements the same interface as AsyncStorage but backed by MMKV.
 */
export const supabaseStorage = {
  getItem: (key: string): string | null => {
    return storage.getString(key) ?? null;
  },
  setItem: (key: string, value: string): void => {
    storage.set(key, value);
  },
  removeItem: (key: string): void => {
    storage.remove(key);
  },
};
