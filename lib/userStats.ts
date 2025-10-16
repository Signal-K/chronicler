import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HarvestedPlant {
  plantType: string;
  harvestedAt: number;
  classificationId?: number;
  beeType?: string;
  plot1: number;
  plot2: number;
}

export interface UserStats {
  totalPlantsGrown: number;
  totalPlantsHarvested: number;
  harvestedPlants: HarvestedPlant[];
}

const USER_STATS_KEY = 'user_stats';

/**
 * Get user stats from local storage
 */
export async function getUserStats(): Promise<UserStats> {
  try {
    const statsJson = await AsyncStorage.getItem(USER_STATS_KEY);
    if (statsJson) {
      return JSON.parse(statsJson);
    }
  } catch (error) {
    console.error('Error loading user stats:', error);
  }

  // Return default stats if not found
  return {
    totalPlantsGrown: 0,
    totalPlantsHarvested: 0,
    harvestedPlants: [],
  };
}

/**
 * Save user stats to local storage
 */
export async function saveUserStats(stats: UserStats): Promise<void> {
  try {
    await AsyncStorage.setItem(USER_STATS_KEY, JSON.stringify(stats));
    console.log('📊 User stats saved:', stats);
  } catch (error) {
    console.error('Error saving user stats:', error);
  }
}

/**
 * Add a harvested plant to user stats
 */
export async function addHarvestedPlant(
  plantType: string,
  plot1: number,
  plot2: number,
  classificationId?: number,
  beeType?: string
): Promise<void> {
  const stats = await getUserStats();

  const harvestedPlant: HarvestedPlant = {
    plantType,
    harvestedAt: Date.now(),
    classificationId,
    beeType,
    plot1,
    plot2,
  };

  stats.totalPlantsHarvested += 2; // Two plants involved in pollination
  stats.harvestedPlants.push(harvestedPlant);

  await saveUserStats(stats);
}

// Get unique plant types that have been harvested
export async function getUniqueHarvestedPlantTypes(): Promise<string[]> {
  const stats = await getUserStats();
  const uniqueTypes = new Set<string>();

  stats.harvestedPlants.forEach((plant) => {
    uniqueTypes.add(plant.plantType);
  });

  return Array.from(uniqueTypes);
};

// Count - times a plant type has been harvested
export async function getPlantHarvestCount(plantType: string): Promise<number> {
  const stats = await getUserStats();
  return stats.harvestedPlants.filter((plant) => plant.plantType === plantType).length;
};

/**
 * Increment plants grown counter
 */
export async function incrementPlantsGrown(count: number = 1): Promise<void> {
  const stats = await getUserStats();
  stats.totalPlantsGrown += count;
  await saveUserStats(stats);
}
