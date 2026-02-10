import { Platform } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

// --- Core MMKV instance ---
export const storage = new MMKV({
  id: 'lasu-financial-storage',
});

// --- Zustand persist adapter ---
export const zustandStorage: StateStorage = {
  getItem: (name: string) => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(name);
    }
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') return;
      localStorage.setItem(name, value);
      return;
    }
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(name);
      return;
    }
    storage.delete(name);
  },
};

// --- Supabase auth adapter ---
export const supabaseStorage = {
  getItem: (key: string) => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(key);
    }
    const value = storage.getString(key);
    return value ?? null;
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') return;
      localStorage.setItem(key, value);
      return;
    }
    storage.set(key, value);
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return;
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    storage.delete(key);
  },
};
