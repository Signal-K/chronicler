import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

// Keys for all local data that needs to be preserved
const LOCAL_DATA_KEYS = [
  'plots',
  'inventory', 
  'hives',
  'hive_nectar_levels',
  'player_experience', // New XP system
  'user_stats',
  'merchant_affinity',
  // 'active_orders' removed
  'pollination_factor',
  'user_experience', // Legacy system (to be migrated)
  // 'last_order_generation' removed
  'honeyFastForwardRequest',
  'honeyFastForwardTrigger',
  // Add any other keys as needed
] as const;

export type LocalDataBackup = Record<string, string | null>;

/**
 * Create a backup of all local progress data
 */
export async function backupLocalData(): Promise<LocalDataBackup> {
  console.log('💾 Creating local data backup...');
  
  try {
    const backup: LocalDataBackup = {};
    
    // Get all local data using multiGet for efficiency
    const results = await AsyncStorage.multiGet(LOCAL_DATA_KEYS as readonly string[]);
    
    results.forEach(([key, value]) => {
      backup[key] = value;
      if (value) {
        console.log(`📦 Backed up ${key}: ${value.length} chars`);
      }
    });
    
    console.log(`✅ Backup complete: ${Object.keys(backup).length} keys backed up`);
    return backup;
  } catch (error) {
    console.error('❌ Failed to backup local data:', error);
    throw new Error('Failed to create data backup');
  }
}

/**
 * Restore local progress from backup
 */
export async function restoreLocalData(backup: LocalDataBackup): Promise<void> {
  console.log('📥 Restoring local data from backup...');
  
  try {
    // Prepare data for multiSet (filter out null values)
    const dataToRestore: [string, string][] = Object.entries(backup)
      .filter(([_, value]) => value !== null)
      .map(([key, value]) => [key, value as string]);
    
    if (dataToRestore.length > 0) {
      await AsyncStorage.multiSet(dataToRestore);
      console.log(`✅ Restored ${dataToRestore.length} data keys`);
      
      dataToRestore.forEach(([key, value]) => {
        console.log(`📦 Restored ${key}: ${value.length} chars`);
      });
    } else {
      console.log('ℹ️ No data to restore (backup was empty)');
    }
  } catch (error) {
    console.error('❌ Failed to restore local data:', error);
    throw new Error('Failed to restore data from backup');
  }
}

/**
 * Enhanced login that preserves local progress
 * Usage: Call this instead of supabase.auth.signInWithPassword
 */
export async function signInWithProgressPreservation(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('🔐 Starting login with progress preservation...');
    
    // Step 1: Backup current local data
    const localBackup = await backupLocalData();
    
    // Step 2: Attempt login
    console.log('🔑 Attempting Supabase login...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('❌ Login failed:', error.message);
      return { success: false, error: error.message };
    }
    
    if (!data.session) {
      console.error('❌ Login succeeded but no session returned');
      return { success: false, error: 'No session returned after login' };
    }
    
    console.log('✅ Login successful! User ID:', data.user?.id);
    
    // Step 3: Restore local data after successful login
    console.log('🔄 Restoring local progress...');
    await restoreLocalData(localBackup);
    
    console.log('🎉 Login with progress preservation complete!');
    return { success: true };
    
  } catch (error: any) {
    console.error('💥 Critical error during login with progress preservation:', error);
    return { 
      success: false, 
      error: error?.message || 'Unknown error during login process' 
    };
  }
}

/**
 * Enhanced sign up that preserves local progress
 * Usage: Call this instead of supabase.auth.signUp
 */
export async function signUpWithProgressPreservation(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; needsEmailVerification?: boolean }> {
  try {
    console.log('📝 Starting sign up with progress preservation...');
    
    // Step 1: Backup current local data
    const localBackup = await backupLocalData();
    
    // Step 2: Attempt sign up
    console.log('📧 Attempting Supabase sign up...');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error('❌ Sign up failed:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Sign up successful! User ID:', data.user?.id);
    
    // Step 3: Restore local data after successful sign up
    console.log('🔄 Restoring local progress...');
    await restoreLocalData(localBackup);
    
    // Check if email confirmation is needed
    const needsEmailVerification = !data.session && !!data.user && !data.user.email_confirmed_at;
    
    console.log('🎉 Sign up with progress preservation complete!');
    return { 
      success: true, 
      needsEmailVerification 
    };
    
  } catch (error: any) {
    console.error('💥 Critical error during sign up with progress preservation:', error);
    return { 
      success: false, 
      error: error?.message || 'Unknown error during sign up process' 
    };
  }
}

/**
 * Enhanced guest account upgrade that preserves local progress
 * Usage: Call this instead of supabase.auth.updateUser
 */
export async function upgradeGuestWithProgressPreservation(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('⬆️ Starting guest account upgrade with progress preservation...');
    
    // Step 1: Backup current local data
    const localBackup = await backupLocalData();
    
    // Step 2: Attempt upgrade
    console.log('🔄 Upgrading guest account...');
    const { data, error } = await supabase.auth.updateUser({
      email,
      password,
    });
    
    if (error) {
      console.error('❌ Guest upgrade failed:', error.message);
      // Restore data in case of failure
      await restoreLocalData(localBackup);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Guest upgrade successful! User ID:', data.user?.id);
    
    // Step 3: Restore local data after successful upgrade
    console.log('🔄 Restoring local progress...');
    await restoreLocalData(localBackup);
    
    console.log('🎉 Guest upgrade with progress preservation complete!');
    return { success: true };
    
  } catch (error: any) {
    console.error('💥 Critical error during guest upgrade with progress preservation:', error);
    return { 
      success: false, 
      error: error?.message || 'Unknown error during upgrade process' 
    };
  }
}

/**
 * Get a summary of current local data for display to user
 */
export async function getLocalDataSummary(): Promise<{
  totalKeys: number;
  totalDataSize: number;
  keyDetails: { key: string; size: number; hasData: boolean }[];
}> {
  try {
    const results = await AsyncStorage.multiGet(LOCAL_DATA_KEYS as readonly string[]);
    
    let totalDataSize = 0;
    const keyDetails = results.map(([key, value]) => {
      const size = value ? value.length : 0;
      totalDataSize += size;
      
      return {
        key,
        size,
        hasData: !!value
      };
    });
    
    return {
      totalKeys: LOCAL_DATA_KEYS.length,
      totalDataSize,
      keyDetails: keyDetails.filter(item => item.hasData) // Only show keys with data
    };
  } catch (error) {
    console.error('Error getting local data summary:', error);
    return {
      totalKeys: 0,
      totalDataSize: 0,
      keyDetails: []
    };
  }
}

/**
 * Migrate old experience system to new one (one-time migration)
 * This should be called after login to ensure data consistency
 */
export async function migrateExperienceData(): Promise<void> {
  try {
    console.log('🔄 Checking for experience system migration...');
    
    // Check if migration is needed
    const [oldExperience, newExperience] = await Promise.all([
      AsyncStorage.getItem('user_experience'),
      AsyncStorage.getItem('player_experience')
    ]);
    
    // If new system doesn't exist but old system does, migrate
    if (!newExperience && oldExperience) {
      console.log('📦 Migrating old experience data to new system...');
      
      const oldData = JSON.parse(oldExperience);
      
      // Import the new experience system functions
      const { awardHarvestXP, awardPollinationXP } = await import('./experienceSystem');
      
      // Award XP for existing harvests (simplified migration)
      if (oldData.totalHarvests) {
        console.log(`🌱 Migrating ${oldData.totalHarvests} harvests...`);
        
        // Award basic harvest XP (can't distinguish first-time vs repeat harvests)
        const totalHarvestXP = oldData.totalHarvests * 1; // 1 XP per harvest
        
        // Create a basic migration entry
        const migrationData = {
          totalXP: totalHarvestXP,
          level: 1,
          harvestsCount: oldData.totalHarvests,
          uniqueHarvests: new Set(oldData.uniqueCropsGrown || []),
          pollinationEvents: 0,
          salesCompleted: 0,
          lastLevelUpXP: 0,
          nextLevelXP: 100,
        };
        
        // Save migrated data
        await AsyncStorage.setItem('player_experience', JSON.stringify({
          ...migrationData,
          uniqueHarvests: Array.from(migrationData.uniqueHarvests)
        }));
        
        console.log('✅ Experience migration complete');
        console.log('📊 Migrated data:', {
          totalXP: totalHarvestXP,
          harvests: oldData.totalHarvests,
          uniqueCrops: migrationData.uniqueHarvests.size
        });
      }
    } else {
      console.log('ℹ️ No experience migration needed');
    }
  } catch (error) {
    console.error('❌ Experience migration failed:', error);
    // Non-critical error, don't throw
  }
}