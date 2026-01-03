import AsyncStorage from '@react-native-async-storage/async-storage';
import type { HiveData, PollinationMilestone } from '../types/hive';

const MILESTONE_STORAGE_KEY = 'pollination_milestones';
const MILESTONE_INTERVAL = 10;
const DEFAULT_HIVE_CAPACITY = 10;

/**
 * Calculate total hive capacity and availability
 */
function calculateHiveCapacity(hives: HiveData[]) {
  let totalCapacity = 0;
  let currentBees = 0;
  const availableHives: HiveData[] = [];
  
  hives.forEach(hive => {
    const maxCapacity = hive.maxCapacity || DEFAULT_HIVE_CAPACITY;
    totalCapacity += maxCapacity;
    currentBees += hive.beeCount;
    
    if (hive.beeCount < maxCapacity) {
      availableHives.push(hive);
    }
  });
  
  return {
    totalCapacity,
    currentBees,
    availableCapacity: totalCapacity - currentBees,
    availableHives
  };
}

// Check if pollination score has crossed a new multiple of 10; award bees if hive capacity
export async function checkForBeeHatching(
    currentScore: number,
    hives: HiveData[],
): Promise<{
    newBeesHatched: number;
    targetHiveId?: string;
    message?: string;
    shouldShowAlert: boolean;
}> {
    // Check if we've already processed this score milestone to prevent duplicates
    const milestones = await loadMilestones();
    const lastProcessedScore = milestones.length > 0 
        ? Math.max(...milestones.map(m => m.score))
        : 0;
    
    // Only process if we've reached a new score milestone
    const currentMilestone = Math.floor(currentScore / MILESTONE_INTERVAL) * MILESTONE_INTERVAL;
    if (currentMilestone <= lastProcessedScore) {
        return {
            newBeesHatched: 0,
            shouldShowAlert: false,
        };
    }
    
    // Calculate how many bees the user should have based on score
    const beesTheyDeserve = Math.floor(currentScore / MILESTONE_INTERVAL);
    
    // Calculate how many bees they currently have
    const { currentBees, availableCapacity, availableHives } = calculateHiveCapacity(hives);
    
    // Only award bees if they deserve more than they have
    const beesToAward = Math.max(0, beesTheyDeserve - currentBees);
    
    if (beesToAward > 0) {
        // Check if there's capacity for new bees
        if (availableCapacity > 0 && availableHives.length > 0) {
            // Award only as many as there's capacity for
            const actualBeesToAward = Math.min(beesToAward, availableCapacity);
            
            if (actualBeesToAward > 0) {
                const targetHive = availableHives.reduce((best: HiveData, current: HiveData) => {
                    const bestCapacity = (best.maxCapacity || DEFAULT_HIVE_CAPACITY) - best.beeCount;
                    const currentCapacity = (current.maxCapacity || DEFAULT_HIVE_CAPACITY) - current.beeCount;
                    return currentCapacity > bestCapacity ? current : best;
                });

                // Record milestone to prevent duplicate awards
                const newMilestone: PollinationMilestone = {
                    score: currentMilestone,
                    timestamp: Date.now(),
                    beesAwarded: actualBeesToAward,
                };

                await saveMilestone(newMilestone);

                const message = actualBeesToAward === 1
                    ? `Your pollination efforts have attracted a new bee to your ${targetHive.id}! (Score: ${currentScore})`
                    : `Your pollination efforts have attracted ${actualBeesToAward} new bees! (Score: ${currentScore})`;
                
                return {
                    newBeesHatched: actualBeesToAward,
                    targetHiveId: targetHive.id,
                    message,
                    shouldShowAlert: true,
                };
            }
        } else {
            // They deserve bees but no capacity
            const newMilestone: PollinationMilestone = {
                score: currentMilestone,
                timestamp: Date.now(),
                beesAwarded: 0,
            };

            await saveMilestone(newMilestone);

            return {
                newBeesHatched: 0,
                message: `Your hives are at full capacity! Build more hives to house new bees. (Score: ${currentScore})`,
                shouldShowAlert: true
            };
        }
    }
    
    return {
        newBeesHatched: 0,
        shouldShowAlert: false,
    };
};

/**
 * Load milestones from storage
 */
async function loadMilestones(): Promise<PollinationMilestone[]> {
    try {
        const stored = await AsyncStorage.getItem(MILESTONE_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error: any) {
        console.error("Error loading pollination milestones: ", error);
        return [];
    }
}

/**
 * Save a new milestone to storage
 */
async function saveMilestone(milestone: PollinationMilestone): Promise<void> {
    try {
        const existing = await loadMilestones();
        const updated = [...existing, milestone];
        await AsyncStorage.setItem(MILESTONE_STORAGE_KEY, JSON.stringify(updated));
    } catch (error: any) {
        console.error('Error saving pollination milestone:', error);
    }
}

/**
 * Reset milestones (for testing or game reset)
 */
export async function resetMilestones(): Promise<void> {
    try {
        await AsyncStorage.removeItem(MILESTONE_STORAGE_KEY);
    } catch (error: any) {
        console.error("Error resetting milestones: ", error);
    }
}

export async function getMilestoneHistory(): Promise<PollinationMilestone[]> {
    return await loadMilestones();
};