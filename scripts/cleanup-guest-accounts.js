#!/usr/bin/env node

/**
 * Guest Account Cleanup Script
 * 
 * This script removes local guest accounts that are older than 1 day.
 * Useful for development when running the simulator repeatedly.
 * 
 * Usage:
 *   node scripts/cleanup-guest-accounts.js
 * 
 * Or add to package.json:
 *   "scripts": {
 *     "cleanup:guests": "node scripts/cleanup-guest-accounts.js"
 *   }
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

async function cleanupOldGuestAccounts() {
  console.log('🧹 Starting guest account cleanup...');
  
  try {
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Error fetching session:', sessionError);
      return;
    }

    if (!session) {
      console.log('ℹ️  No active session found');
      return;
    }

    const user = session.user;
    
    // Check if current user is anonymous
    if (!user.is_anonymous) {
      console.log('ℹ️  Current user is not a guest account, skipping cleanup');
      return;
    }

    // Get account creation time
    const createdAt = new Date(user.created_at).getTime();
    const now = Date.now();
    const accountAge = now - createdAt;

    console.log(`📅 Guest account age: ${Math.floor(accountAge / (60 * 60 * 1000))} hours`);

    // If account is older than 1 day, sign out and clear local storage
    if (accountAge > ONE_DAY_MS) {
      console.log('🗑️  Guest account is older than 1 day, removing...');
      
      // Sign out
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        console.error('❌ Error signing out:', signOutError);
        return;
      }

      // Clear all AsyncStorage data
      await AsyncStorage.clear();
      
      console.log('✅ Old guest account removed successfully');
      console.log('ℹ️  A new guest account will be created on next app launch');
    } else {
      const remainingHours = Math.ceil((ONE_DAY_MS - accountAge) / (60 * 60 * 1000));
      console.log(`✅ Guest account is fresh (will be cleaned up in ${remainingHours} hours)`);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error during cleanup:', error);
  }
}

// Run cleanup
cleanupOldGuestAccounts().then(() => {
  console.log('🎉 Cleanup process completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
