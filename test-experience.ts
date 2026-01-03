// Test file to verify the experience system works correctly
// Run: npx ts-node --skipProject test-experience.ts

import {
    awardHarvestXP,
    awardPollinationXP,
    awardSaleXP,
    calculateLevelFromXP,
    calculateXPForLevel,
    getPlayerExperienceInfo
} from './lib/experienceSystem';

async function testExperienceSystem() {
  console.log('🧪 Testing Experience System...\n');

  // Test XP calculations
  console.log('📊 Level XP Requirements:');
  for (let level = 1; level <= 10; level++) {
    const xp = calculateXPForLevel(level);
    console.log(`Level ${level}: ${xp} XP`);
  }
  console.log();

  // Test level calculation from XP
  console.log('📈 XP to Level Conversion:');
  const testXPs = [0, 50, 100, 200, 250, 400, 500, 750, 1000];
  testXPs.forEach(xp => {
    const level = calculateLevelFromXP(xp);
    console.log(`${xp} XP = Level ${level}`);
  });
  console.log();

  // Test initial state
  console.log('🎯 Initial Experience:');
  let exp = await getPlayerExperienceInfo();
  console.log(exp);
  console.log();

  // Test harvesting (should give 1 XP + 10 for first time)
  console.log('🌱 Testing Harvest XP:');
  const harvestEvents = await awardHarvestXP('tomato');
  harvestEvents.forEach(event => {
    console.log(`+${event.amount} XP: ${event.description}`);
  });
  
  exp = await getPlayerExperienceInfo();
  console.log('Total XP after first tomato harvest:', exp.totalXP);
  console.log('Level:', exp.level);
  console.log();

  // Test second harvest of same crop (should only give 1 XP)
  console.log('🌱 Testing Second Harvest of Same Crop:');
  const harvestEvents2 = await awardHarvestXP('tomato');
  harvestEvents2.forEach(event => {
    console.log(`+${event.amount} XP: ${event.description}`);
  });
  
  exp = await getPlayerExperienceInfo();
  console.log('Total XP after second tomato harvest:', exp.totalXP);
  console.log();

  // Test pollination XP
  console.log('🐝 Testing Pollination XP:');
  const pollinationEvent = await awardPollinationXP();
  console.log(`+${pollinationEvent.amount} XP: ${pollinationEvent.description}`);
  
  exp = await getPlayerExperienceInfo();
  console.log('Total XP after pollination:', exp.totalXP);
  console.log();

  // Test sale XP
  console.log('💰 Testing Sale XP:');
  const saleEvent = await awardSaleXP('complex');
  console.log(`+${saleEvent.amount} XP: ${saleEvent.description}`);
  
  exp = await getPlayerExperienceInfo();
  console.log('Total XP after sale:', exp.totalXP);
  console.log('Current Level:', exp.level);
  console.log('Progress:', Math.round(exp.progress * 100) + '%');
  console.log();

  console.log('✅ Experience System Test Complete!');
}

// Uncomment to run the test:
// testExperienceSystem().catch(console.error);