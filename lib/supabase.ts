import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Create a storage adapter that handles SSR gracefully
const safeAsyncStorage = {
  setItem: (key: string, value: string) => {
    if (!isBrowser) return Promise.resolve();
    return AsyncStorage.setItem(key, value);
  },
  getItem: (key: string) => {
    if (!isBrowser) return Promise.resolve(null);
    return AsyncStorage.getItem(key);
  },
  removeItem: (key: string) => {
    if (!isBrowser) return Promise.resolve();
    return AsyncStorage.removeItem(key);
  },
};

// Resolve env values across Expo and Next.js naming conventions.
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  const err = 'Supabase configuration missing. Set EXPO_PUBLIC_SUPABASE_* or NEXT_PUBLIC_SUPABASE_* env vars.';
  if (isDev) {
    console.error(`❗ ${err}`);
    console.error('Current values -> URL:', SUPABASE_URL || '<MISSING>', 'Anon Key present?:', !!SUPABASE_ANON_KEY);
  } else {
    throw new Error(err);
  }
} else {
  if (isDev) {
    const maskedKey = `${SUPABASE_ANON_KEY.substring(0, 8)}...${SUPABASE_ANON_KEY.slice(-4)}`;
    console.log('🔧 Supabase Configuration:');
    console.log('📍 URL:', SUPABASE_URL);
    console.log('🔑 Anon Key (masked):', maskedKey);
  }
}

const url = SUPABASE_URL || 'https://placeholder.supabase.co';
const key = SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(url, key, {
  auth: {
    storage: safeAsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
