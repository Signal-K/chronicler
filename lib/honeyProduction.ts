import { calculateHoneyBlend, calculateNectarProduction, getCropConfig } from './cropConfig';

export interface HoneyBatch {
  id: string;
  sources: { [cropId: string]: number }; // cropId -> nectar amount contributed
  quality: number;
  amount: number; // Total honey amount
  createdAt: Date;
  dominantFlavor: string;
  color: string;
  description: string;
  isComplete: boolean; // Whether this batch is ready for harvest
}

export interface HiveState {
  id: string;
  currentBatch: HoneyBatch | null;
  completedBatches: HoneyBatch[];
  totalHoneyStored: number;
  lastPollinationTime: Date;
  dailyNectarCollection: { [cropId: string]: number }; // Track daily nectar by crop
}

export interface PollinationData {
  cropId: string;
  plotId: string;
  nectarCollected: number;
  pollenCollected: number;
  timestamp: Date;
}

/**
 * Initialize a new hive state
 */
export function createNewHive(hiveId: string): HiveState {
  return {
    id: hiveId,
    currentBatch: null,
    completedBatches: [],
    totalHoneyStored: 0,
    lastPollinationTime: new Date(),
    dailyNectarCollection: {}
  };
}

/**
 * Create a new honey batch
 */
export function createHoneyBatch(): HoneyBatch {
  return {
    id: `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    sources: {},
    quality: 0,
    amount: 0,
    createdAt: new Date(),
    dominantFlavor: '',
    color: '',
    description: '',
    isComplete: false
  };
}

/**
 * Process bee pollination of a crop plot
 */
export function processPollinationVisit(
  cropId: string,
  plotId: string,
  currentHour: number,
  cropGrowthStage: number // 0-3, only stage 3 (ready) produces nectar
): PollinationData | null {
  const config = getCropConfig(cropId);
  
  if (!config || !config.nectar.producesNectar || cropGrowthStage < 2) {
    return null; // No nectar from this crop or it's too young
  }

  // Mature crops (stage 2+) produce some nectar, full crops (stage 3) produce maximum
  const maturityMultiplier = cropGrowthStage === 3 ? 1.0 : 0.6;
  
  const baseNectar = calculateNectarProduction(cropId, currentHour);
  const nectarCollected = baseNectar * maturityMultiplier;
  
  const pollenCollected = config.nectar.pollen.amount * maturityMultiplier;

  return {
    cropId,
    plotId,
    nectarCollected,
    pollenCollected,
    timestamp: new Date()
  };
}

/**
 * Add nectar to a hive's current batch
 */
export function addNectarToHive(hive: HiveState, pollinationData: PollinationData): HiveState {
  // Initialize current batch if none exists
  if (!hive.currentBatch) {
    hive.currentBatch = createHoneyBatch();
  }

  // Add nectar to current batch
  const cropId = pollinationData.cropId;
  hive.currentBatch.sources[cropId] = (hive.currentBatch.sources[cropId] || 0) + pollinationData.nectarCollected;
  hive.currentBatch.amount += pollinationData.nectarCollected * 0.8; // 80% nectar to honey conversion

  // Update daily collection tracking
  hive.dailyNectarCollection[cropId] = (hive.dailyNectarCollection[cropId] || 0) + pollinationData.nectarCollected;

  // Update batch properties
  updateBatchProperties(hive.currentBatch);

  // Check if batch is complete (arbitrary threshold for now)
  if (hive.currentBatch.amount >= 100) {
    hive.currentBatch.isComplete = true;
  }

  hive.lastPollinationTime = pollinationData.timestamp;

  return hive;
}

/**
 * Update honey batch properties based on nectar sources
 */
function updateBatchProperties(batch: HoneyBatch): void {
  const blendInfo = calculateHoneyBlend(batch.sources);
  
  batch.quality = blendInfo.averageQuality;
  batch.dominantFlavor = blendInfo.dominantHoney.flavor;
  batch.color = blendInfo.dominantHoney.color;
  batch.description = blendInfo.blendDescription;
}

/**
 * Complete a honey batch and start a new one
 */
export function completeBatch(hive: HiveState): HiveState {
  if (hive.currentBatch && hive.currentBatch.isComplete) {
    // Move current batch to completed batches
    hive.completedBatches.push({
      ...hive.currentBatch,
      isComplete: true
    });
    
    // Add to total honey stored
    hive.totalHoneyStored += hive.currentBatch.amount;
    
    // Start new batch
    hive.currentBatch = createHoneyBatch();
  }
  
  return hive;
}

/**
 * Get honey production summary for a hive
 */
export function getHiveProductionSummary(hive: HiveState): {
  currentProduction: string;
  todaysCollection: string;
  totalHoney: number;
  recentSources: string[];
  qualityRating: string;
} {
  const currentProduction = hive.currentBatch 
    ? `${Math.round(hive.currentBatch.amount)}ml of ${hive.currentBatch.description}`
    : 'No active production';

  const todaySources = Object.keys(hive.dailyNectarCollection);
  const todaysCollection = todaySources.length > 0
    ? `Nectar collected from ${todaySources.length} crop type(s): ${todaySources.join(', ')}`
    : 'No nectar collected today';

  const recentSources = Array.from(new Set([
    ...Object.keys(hive.dailyNectarCollection),
    ...(hive.currentBatch ? Object.keys(hive.currentBatch.sources) : [])
  ]));

  const averageQuality = hive.currentBatch?.quality || 0;
  const qualityRating = averageQuality >= 80 ? 'Premium' 
                      : averageQuality >= 60 ? 'Good' 
                      : averageQuality >= 40 ? 'Fair' 
                      : 'Basic';

  return {
    currentProduction,
    todaysCollection,
    totalHoney: Math.round(hive.totalHoneyStored),
    recentSources,
    qualityRating
  };
}

/**
 * Reset daily nectar collection (call this at start of each day)
 */
export function resetDailyCollection(hive: HiveState): HiveState {
  return {
    ...hive,
    dailyNectarCollection: {}
  };
}

/**
 * Simulate bee pollination across all crops for a time period
 */
export function simulatePollinationCycle(
  activeChances: { cropId: string; plotId: string; growthStage: number; position: { x: number; y: number } }[],
  hives: HiveState[],
  currentHour: number,
  beesPerHive: number = 20
): {
  updatedHives: HiveState[];
  pollinationEvents: PollinationData[];
} {
  const pollinationEvents: PollinationData[] = [];
  const updatedHives = [...hives];

  // For each hive, send out bees to visit nearby crops
  updatedHives.forEach((hive, hiveIndex) => {
    const beesToSend = Math.min(beesPerHive, activeChances.length * 2);
    
    for (let beeIndex = 0; beeIndex < beesToSend; beeIndex++) {
      // Randomly select a crop to visit (could be improved with distance calculations)
      const randomCrop = activeChances[Math.floor(Math.random() * activeChances.length)];
      
      const pollinationResult = processPollinationVisit(
        randomCrop.cropId,
        randomCrop.plotId,
        currentHour,
        randomCrop.growthStage
      );
      
      if (pollinationResult) {
        pollinationEvents.push(pollinationResult);
        updatedHives[hiveIndex] = addNectarToHive(updatedHives[hiveIndex], pollinationResult);
      }
    }
  });

  return {
    updatedHives,
    pollinationEvents
  };
}