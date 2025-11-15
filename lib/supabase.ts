import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Create a safe storage adapter that works across platforms and during build time.
// It will only use AsyncStorage if it's on a web platform and window is defined.
const safeAsyncStorage = {
  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return AsyncStorage.setItem(key, value);
    }
    return Promise.resolve();
  },
  getItem: (key: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return AsyncStorage.getItem(key);
    }
    return Promise.resolve(null);
  },
  removeItem: (key: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return AsyncStorage.removeItem(key);
    }
    return Promise.resolve();
  },
};

// Debug logging for environment variables
console.log('🔧 Supabase Configuration:');
console.log('📍 URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log('🔑 Anon Key:', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...');

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: safeAsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);