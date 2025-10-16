import { supabase } from './supabase';
import { getUserStats, HarvestedPlant } from './userStats';

export interface PollinatorData {
  id: string;
  name: string;
  scientificName?: string;
  description: string;
  imageUrl: string;
  encountered: boolean;
  timesEncountered?: number;
}

export interface PlantData {
  type: string;
  name: string;
  scientificName?: string;
  description: string;
  growthStages: number;
  growthTime: number; // in milliseconds
  encountered: boolean;
  timesHarvested: number;
}

/**
 * Get all pollinators the user has encountered
 */
export async function getEncounteredPollinators(): Promise<Set<string>> {
  const encounteredTypes = new Set<string>();
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return encounteredTypes;
    }

    const { data: classifications, error } = await supabase
      .from('classifications')
      .select('classificationConfiguration')
      .eq('author', session.user.id)
      .eq('classificationtype', 'bumble');

    if (error) {
      console.error('Error fetching classifications:', error);
      return encounteredTypes;
    }

    if (classifications) {
      classifications.forEach((classification) => {
        try {
          const config = JSON.parse(classification.classificationConfiguration);
          if (config.selected) {
            encounteredTypes.add(config.selected);
          }
        } catch (e) {
          console.error('Error parsing classification config:', e);
        }
      });
    }
  } catch (error) {
    console.error('Error getting encountered pollinators:', error);
  }

  return encounteredTypes;
}

/**
 * Get all plants the user has harvested with their harvest counts
 */
export async function getHarvestedPlants(): Promise<Map<string, number>> {
  const plantHarvestCounts = new Map<string, number>();
  
  try {
    const userStats = await getUserStats();
    
    userStats.harvestedPlants.forEach((plant: HarvestedPlant) => {
      const currentCount = plantHarvestCounts.get(plant.plantType) || 0;
      plantHarvestCounts.set(plant.plantType, currentCount + 1);
    });
  } catch (error) {
    console.error('Error getting harvested plants:', error);
  }

  return plantHarvestCounts;
}

/**
 * Get almanac statistics
 */
export async function getAlmanacStats() {
  const [encounteredPollinators, harvestedPlants] = await Promise.all([
    getEncounteredPollinators(),
    getHarvestedPlants(),
  ]);

  return {
    totalPollinatorsEncountered: encounteredPollinators.size,
    totalPlantTypesHarvested: harvestedPlants.size,
    totalPlantsHarvested: Array.from(harvestedPlants.values()).reduce((sum, count) => sum + count, 0),
  };
}