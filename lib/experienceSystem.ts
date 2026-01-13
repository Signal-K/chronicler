import AsyncStorage from '@react-native-async-storage/async-storage';

const XP_STORAGE_KEY = 'player_experience';

interface PlayerExperience {
  totalXP: number;
  level: number;
  harvestsCount: number;
  uniqueHarvests: Set<string>; // Track first-time harvests for bonus XP
  pollinationEvents: number;
  salesCompleted: number;
  classificationsCompleted: number;
  lastLevelUpXP: number; // XP required for current level
  nextLevelXP: number; // XP required for next level
}

export interface PlayerExperienceInfo extends Omit<PlayerExperience, 'uniqueHarvests'> {
  uniqueHarvests: string[]; // Serialized version for UI
  progress: number; // 0-1 progress within current level
  xpInCurrentLevel: number; // XP earned in current level
  xpNeededForNext: number; // XP needed to reach next level
}

export interface XPGainEvent {
  type: 'harvest' | 'first_harvest' | 'pollination' | 'sale' | 'classification';
  amount: number;
  description: string;
  cropType?: string; // For harvest events
  // orderComplexity removed
}

/**
 * Calculate XP required for a specific level using sliding scale
 * Formula: Level 1 = 0, Level 2 = 100, Level 3 = 250, Level 4 = 450, etc.
 * Each level requires progressively more XP: base + (level-1) * multiplier
 */
export function calculateXPForLevel(level: number): number {
  if (level <= 1) return 0;
  
  // Sliding scale: each level requires more XP than the last
  const baseXP = 100;
  const multiplier = 75;
  
  let totalXP = 0;
  for (let i = 2; i <= level; i++) {
    totalXP += baseXP + (i - 2) * multiplier;
  }
  
  return totalXP;
}

/**
 * Calculate what level a player should be based on their total XP
 */
export function calculateLevelFromXP(totalXP: number): number {
  let level = 1;
  while (calculateXPForLevel(level + 1) <= totalXP) {
    level++;
  }
  return level;
}

/**
 * Get XP progress for current level (0-1 ratio)
 */
export function getXPProgress(totalXP: number): { 
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progress: number;
} {
  const level = calculateLevelFromXP(totalXP);
  const currentLevelXP = calculateXPForLevel(level);
  const nextLevelXP = calculateXPForLevel(level + 1);
  
  const xpInCurrentLevel = totalXP - currentLevelXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
  const progress = xpNeededForNextLevel > 0 ? xpInCurrentLevel / xpNeededForNextLevel : 1;
  
  return {
    level,
    currentLevelXP: xpInCurrentLevel,
    nextLevelXP: xpNeededForNextLevel,
    progress: Math.min(progress, 1),
  };
}

/**
 * Load player experience from storage
 */
export async function loadPlayerExperience(): Promise<PlayerExperience> {
  try {
    const stored = await AsyncStorage.getItem(XP_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const totalXP = parsed.totalXP || 0;
      const level = calculateLevelFromXP(totalXP);
      
      return {
        totalXP,
        level,
        harvestsCount: parsed.harvestsCount || 0,
        uniqueHarvests: new Set(parsed.uniqueHarvests || []),
        pollinationEvents: parsed.pollinationEvents || 0,
        salesCompleted: parsed.salesCompleted || 0,
        classificationsCompleted: parsed.classificationsCompleted || 0,
        lastLevelUpXP: calculateXPForLevel(level),
        nextLevelXP: calculateXPForLevel(level + 1),
      };
    }
  } catch (error) {
    console.error('Error loading player experience:', error);
  }
  
  return {
    totalXP: 0,
    level: 1,
    harvestsCount: 0,
    uniqueHarvests: new Set(),
    pollinationEvents: 0,
    salesCompleted: 0,
    classificationsCompleted: 0,
    lastLevelUpXP: 0,
    nextLevelXP: calculateXPForLevel(2),
  };
}

/**
 * Save player experience to storage
 */
export async function savePlayerExperience(experience: PlayerExperience): Promise<void> {
  try {
    const toStore = {
      totalXP: experience.totalXP,
      level: experience.level,
      harvestsCount: experience.harvestsCount,
      uniqueHarvests: Array.from(experience.uniqueHarvests),
      pollinationEvents: experience.pollinationEvents,
      salesCompleted: experience.salesCompleted,
      classificationsCompleted: experience.classificationsCompleted,
      lastLevelUpXP: experience.lastLevelUpXP,
      nextLevelXP: experience.nextLevelXP,
    };
    await AsyncStorage.setItem(XP_STORAGE_KEY, JSON.stringify(toStore));
  } catch (error) {
    console.error('Error saving player experience:', error);
  }
}

/**
 * Award XP for harvesting a plant
 * +1 XP for regular harvest, +10 XP for first time harvesting this crop type
 */
export async function awardHarvestXP(cropType: string): Promise<XPGainEvent[]> {
  const experience = await loadPlayerExperience();
  const events: XPGainEvent[] = [];
  
  // Check if this is a first-time harvest
  const isFirstHarvest = !experience.uniqueHarvests.has(cropType);
  
  // Award regular harvest XP
  experience.totalXP += 1;
  experience.harvestsCount += 1;
  events.push({
    type: 'harvest',
    amount: 1,
    description: `Harvested ${cropType}`,
    cropType,
  });
  
  // Award bonus XP for first-time harvest
  if (isFirstHarvest) {
    experience.uniqueHarvests.add(cropType);
    experience.totalXP += 10;
    events.push({
      type: 'first_harvest',
      amount: 10,
      description: `First time harvesting ${cropType}!`,
      cropType,
    });
  }
  
  // Update level information
  experience.level = calculateLevelFromXP(experience.totalXP);
  experience.lastLevelUpXP = calculateXPForLevel(experience.level);
  experience.nextLevelXP = calculateXPForLevel(experience.level + 1);
  
  await savePlayerExperience(experience);
  return events;
}

/**
 * Award XP for pollination event (citizen science contribution)
 * +10 XP per pollination event
 */
export async function awardPollinationXP(): Promise<XPGainEvent> {
  const experience = await loadPlayerExperience();
  
  experience.totalXP += 10;
  experience.pollinationEvents += 1;
  
  // Update level information
  experience.level = calculateLevelFromXP(experience.totalXP);
  experience.lastLevelUpXP = calculateXPForLevel(experience.level);
  experience.nextLevelXP = calculateXPForLevel(experience.level + 1);
  
  await savePlayerExperience(experience);
  
  return {
    type: 'pollination',
    amount: 10,
    description: 'Citizen science contribution!',
  };
}

/**
 * Award XP for bee classification
 * +10 XP per classification
 */
export async function awardClassificationXP(): Promise<XPGainEvent> {
  const experience = await loadPlayerExperience();
  
  experience.totalXP += 10;
  experience.classificationsCompleted += 1;
  
  // Update level information
  experience.level = calculateLevelFromXP(experience.totalXP);
  experience.lastLevelUpXP = calculateXPForLevel(experience.level);
  experience.nextLevelXP = calculateXPForLevel(experience.level + 1);
  
  await savePlayerExperience(experience);
  
  return {
    type: 'classification',
    amount: 10,
    description: 'Bee classification completed!',
  };
}

/**
 * Award XP for completing a honey order sale
 * XP varies based on order complexity and honey type
 */
export async function awardSaleXP(
  xpAmount: number,
  honeyType: string,
  bottlesCount: number
): Promise<XPGainEvent> {
  const experience = await loadPlayerExperience();
  
  experience.totalXP += xpAmount;
  experience.salesCompleted += 1;
  
  // Update level information
  experience.level = calculateLevelFromXP(experience.totalXP);
  experience.lastLevelUpXP = calculateXPForLevel(experience.level);
  experience.nextLevelXP = calculateXPForLevel(experience.level + 1);
  
  await savePlayerExperience(experience);
  
  return {
    type: 'sale',
    amount: xpAmount,
    description: `Sold ${bottlesCount} bottles of ${honeyType} honey!`,
  };
}



/**
 * Get current player experience with level progress
 */
export async function getPlayerExperienceInfo(): Promise<PlayerExperienceInfo> {
  const experience = await loadPlayerExperience();
  const progressInfo = getXPProgress(experience.totalXP);
  
  return {
    ...experience,
    uniqueHarvests: Array.from(experience.uniqueHarvests),
    progress: progressInfo.progress,
    xpInCurrentLevel: progressInfo.currentLevelXP,
    xpNeededForNext: progressInfo.nextLevelXP,
  };
}

