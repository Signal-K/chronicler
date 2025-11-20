import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Create a storage adapter that uses AsyncStorage for native platforms
// and regular AsyncStorage for web (which uses localStorage under the hood)
const safeAsyncStorage = {
  setItem: (key: string, value: string) => {
    return AsyncStorage.setItem(key, value);
  },
  getItem: (key: string) => {
    return AsyncStorage.getItem(key);
  },
  removeItem: (key: string) => {
    return AsyncStorage.removeItem(key);
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