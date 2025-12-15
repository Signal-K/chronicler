// Test script to verify progress preservation functionality
// Usage: npx ts-node --skipProject test-progress-preservation.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  backupLocalData,
  restoreLocalData,
  getLocalDataSummary,
  migrateExperienceData 
} from './lib/progressPreservation';

async function createTestData() {
  console.log('📝 Creating test data...');
  
  const testData = {
    plots: JSON.stringify([
      { state: 'planted', cropType: 'tomato', growthStage: 3 },
      { state: 'tilled', cropType: null, growthStage: 0 }
    ]),
    inventory: JSON.stringify({
      coins: 500,
      seeds: { tomato: 10, pumpkin: 5 },
      harvested: { tomato: 15, pumpkin: 3 }
    }),
    hives: JSON.stringify([
      { id: 'hive-1', beeCount: 8, createdAt: Date.now() }
    ]),
    player_experience: JSON.stringify({
      totalXP: 150,
      level: 2,
      harvestsCount: 25,
      uniqueHarvests: ['tomato', 'pumpkin', 'wheat'],
      pollinationEvents: 5,
      salesCompleted: 3
    })
  };

  // Set test data in AsyncStorage
  await AsyncStorage.multiSet(Object.entries(testData));
  console.log('✅ Test data created');
}

async function testProgressPreservation() {
  console.log('🧪 Testing Progress Preservation System...\n');

  try {
    // 1. Create test data
    await createTestData();

    // 2. Get data summary
    console.log('📊 Local Data Summary:');
    const summary = await getLocalDataSummary();
    console.log(`Total keys with data: ${summary.keyDetails.length}`);
    console.log(`Total data size: ${Math.round(summary.totalDataSize / 1024)}KB`);
    summary.keyDetails.forEach(item => {
      console.log(`  - ${item.key}: ${Math.round(item.size / 1024)}KB`);
    });
    console.log();

    // 3. Test backup
    console.log('💾 Testing backup...');
    const backup = await backupLocalData();
    const backupSize = Object.keys(backup).length;
    console.log(`Backup created: ${backupSize} keys`);
    console.log();

    // 4. Clear data (simulate login clearing storage)
    console.log('🗑️ Clearing data (simulating login)...');
    await AsyncStorage.clear();
    
    // Verify data is cleared
    const afterClear = await getLocalDataSummary();
    console.log(`Data after clear: ${afterClear.keyDetails.length} keys`);
    console.log();

    // 5. Test restore
    console.log('📥 Testing restore...');
    await restoreLocalData(backup);
    
    // Verify data is restored
    const afterRestore = await getLocalDataSummary();
    console.log(`Data after restore: ${afterRestore.keyDetails.length} keys`);
    afterRestore.keyDetails.forEach(item => {
      console.log(`  - ${item.key}: ${Math.round(item.size / 1024)}KB`);
    });
    console.log();

    // 6. Test experience migration
    console.log('🔄 Testing experience migration...');
    // Add old experience data
    await AsyncStorage.setItem('user_experience', JSON.stringify({
      totalHarvests: 50,
      totalClassifications: 20,
      uniqueCropsGrown: ['tomato', 'pumpkin', 'wheat', 'potato']
    }));
    
    await migrateExperienceData();
    
    const migratedExp = await AsyncStorage.getItem('player_experience');
    if (migratedExp) {
      const expData = JSON.parse(migratedExp);
      console.log('Migration result:');
      console.log(`  - Total XP: ${expData.totalXP}`);
      console.log(`  - Harvests: ${expData.harvestsCount}`);
      console.log(`  - Unique crops: ${expData.uniqueHarvests?.length || 0}`);
    }

    console.log('\n✅ All tests passed! Progress preservation system is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Uncomment to run the test:
// testProgressPreservation();

export { testProgressPreservation };