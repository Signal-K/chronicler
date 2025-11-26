import AsyncStorage from '@react-native-async-storage/async-storage';

const EXPERIENCE_STORAGE_KEY = 'user_experience';

export interface UserExperienceData {
  totalHarvests: number;
  totalClassifications: number;
  uniqueCropsGrown: Set<string>;
}

/**
 * Calculate user experience level based on their activities
 * Level 1-10 based on:
 * - Total harvests (weight: 40%)
 * - Total classifications (weight: 30%)
 * - Unique crop types grown (weight: 30%)
 */
export function calculateExperienceLevel(data: UserExperienceData): number {
  const { totalHarvests, totalClassifications, uniqueCropsGrown } = data;
  
  // Scoring thresholds
  const harvestScore = Math.min(totalHarvests / 100, 1) * 4; // Max 4 points
  const classificationScore = Math.min(totalClassifications / 50, 1) * 3; // Max 3 points
  const cropVarietyScore = Math.min(uniqueCropsGrown.size / 10, 1) * 3; // Max 3 points
  
  const totalScore = harvestScore + classificationScore + cropVarietyScore; // 0-10
  
  return Math.max(1, Math.ceil(totalScore));
}

/**
 * Load user experience data from storage
 */
export async function loadUserExperience(): Promise<UserExperienceData> {
  try {
    const stored = await AsyncStorage.getItem(EXPERIENCE_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        totalHarvests: parsed.totalHarvests || 0,
        totalClassifications: parsed.totalClassifications || 0,
        uniqueCropsGrown: new Set(parsed.uniqueCropsGrown || []),
      };
    }
  } catch (error) {
    console.error('Error loading user experience:', error);
  }
  
  return {
    totalHarvests: 0,
    totalClassifications: 0,
    uniqueCropsGrown: new Set(),
  };
}

/**
 * Save user experience data to storage
 */
export async function saveUserExperience(data: UserExperienceData): Promise<void> {
  try {
    const toStore = {
      totalHarvests: data.totalHarvests,
      totalClassifications: data.totalClassifications,
      uniqueCropsGrown: Array.from(data.uniqueCropsGrown),
    };
    await AsyncStorage.setItem(EXPERIENCE_STORAGE_KEY, JSON.stringify(toStore));
  } catch (error) {
    console.error('Error saving user experience:', error);
  }
}

/**
 * Increment harvest count and track crop type
 */
export async function recordHarvest(cropType: string): Promise<void> {
  const experience = await loadUserExperience();
  experience.totalHarvests += 1;
  experience.uniqueCropsGrown.add(cropType);
  await saveUserExperience(experience);
}

/**
 * Increment classification count
 */
export async function recordClassification(): Promise<void> {
  const experience = await loadUserExperience();
  experience.totalClassifications += 1;
  await saveUserExperience(experience);
}

/**
 * Get current experience level
 */
export async function getUserExperienceLevel(): Promise<number> {
  const experience = await loadUserExperience();
  return calculateExperienceLevel(experience);
}

/**
 * Get detailed experience info with level
 */
export async function getUserExperienceInfo() {
  const experience = await loadUserExperience();
  const level = calculateExperienceLevel(experience);
  
  return {
    ...experience,
    uniqueCropsGrown: Array.from(experience.uniqueCropsGrown),
    level,
    progress: {
      harvests: Math.min(experience.totalHarvests / 100, 1) * 100,
      classifications: Math.min(experience.totalClassifications / 50, 1) * 100,
      cropVariety: Math.min(experience.uniqueCropsGrown.size / 10, 1) * 100,
    },
  };
}
