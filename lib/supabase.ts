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

// Debug logging for environment variables (only in browser)
// Read env vars into locals for clarity
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Clearer runtime logging to help diagnose missing configuration in dev builds
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❗ Supabase configuration missing. Make sure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set.');
  console.error('Current values -> URL:', SUPABASE_URL ? SUPABASE_URL : '<MISSING>', 'Anon Key present?:', !!SUPABASE_ANON_KEY);
} else {
  // Mask key when logging
  const maskedKey = SUPABASE_ANON_KEY.substring(0, 8) + '...' + SUPABASE_ANON_KEY.slice(-4);
  console.log('🔧 Supabase Configuration:');
  console.log('📍 URL:', SUPABASE_URL);
  console.log('🔑 Anon Key (masked):', maskedKey);
}

export const supabase = createClient(
  SUPABASE_URL!,
  SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: safeAsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);