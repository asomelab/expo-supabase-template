import { MMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

// --- Core MMKV instance ---
export const storage = new MMKV({
  id: 'lasu-financial-storage',
});

// --- Zustand persist adapter ---
export const zustandStorage: StateStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.delete(name);
  },
};

// --- Supabase auth adapter ---
export const supabaseStorage = {
  getItem: (key: string) => {
    const value = storage.getString(key);
    return value ?? null;
  },
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
};
