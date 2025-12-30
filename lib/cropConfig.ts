export type CropCategory = 'vegetable' | 'fruit' | 'grain' | 'flower';
export type HoneyType = 'light' | 'amber' | 'dark' | 'specialty';
export type HoneyFlavor = 'mild' | 'floral' | 'robust' | 'distinctive' | 'sweet' | 'complex';

export interface NectarProperties {
  /** Whether this crop produces nectar that bees can collect */
  producesNectar: boolean;
  /** Amount of nectar produced per flower visit (0-100) */
  nectarAmount: number;
  /** Quality of nectar (affects honey quality) (0-100) */
  nectarQuality: number;
  /** Honey characteristics from this crop */
  honeyProfile: {
    type: HoneyType;
    flavor: HoneyFlavor;
    color: string; // Hex color or description
    description: string;
  };
  /** Pollen properties */
  pollen: {
    amount: number; // Amount of pollen produced (0-100)
    quality: number; // Pollen quality (0-100)
    color: string; // Pollen color
  };
  /** How attractive this crop is to bees (0-100) */
  beeAttraction: number;
  /** Best time of day for nectar production (0-23 hours) */
  peakNectarHours: [number, number]; // [start, end]
}

export interface CropConfig {
  id: string;
  name: string;
  category: CropCategory;
  emoji: string;
  /** What you need to plant this crop */
  plantRequirement: {
    type: 'seed' | 'crop'; // Some crops plant from seeds, others from the crop itself
    amount: 1; // Always 1 for now
  };
  /** What you get when harvesting */
  harvestYield: {
    crop: {
      min: number;
      max: number;
    };
    seeds?: { // Some crops don't produce seeds
      min: number;
      max: number;
    };
  };
  /** Sell price per unit */
  sellPrice: number;
  /** Growth stage images - paths to image files for each growth stage */
  growthImages: [string, string, string, string]; // [seed/sprout, young, mature, ready]
  /** Nectar and honey production properties */
  nectar: NectarProperties;
}

export const CROP_CONFIGS: Record<string, CropConfig> = {
  tomato: {
    id: 'tomato',
    name: 'Tomato',
    category: 'fruit',
    emoji: '🍅',
    plantRequirement: {
      type: 'seed',
      amount: 1,
    },
    harvestYield: {
      crop: { min: 1, max: 1 },
      seeds: { min: 1, max: 3 },
    },
    sellPrice: 15,
    growthImages: [
      'assets/Sprites/Crops/Wheat/1---Wheat-Seed.png',
      'assets/Sprites/Crops/Wheat/2---Wheat-Sprout.png',
      'assets/Sprites/Crops/Wheat/3---Wheat-Mid.png',
      'assets/Sprites/Crops/Wheat/4---Wheat-Full.png',
    ],
    nectar: {
      producesNectar: true,
      nectarAmount: 35,
      nectarQuality: 60,
      honeyProfile: {
        type: 'light',
        flavor: 'mild',
        color: '#F5E6A8',
        description: 'Light, delicate honey with subtle fruity notes from tomato blossoms'
      },
      pollen: {
        amount: 45,
        quality: 65,
        color: '#FFE135'
      },
      beeAttraction: 55,
      peakNectarHours: [8, 12]
    },
  },
  pumpkin: {
    id: 'pumpkin',
    name: 'Pumpkin',
    category: 'vegetable',
    emoji: '🎃',
    plantRequirement: {
      type: 'seed',
      amount: 1,
    },
    harvestYield: {
      crop: { min: 2, max: 3 }, // Vegetables give more crops, no seeds
      seeds: undefined,
    },
    sellPrice: 12,
    growthImages: [
      'assets/Sprites/Crops/Wheat/1---Wheat-Seed.png',
      'assets/Sprites/Crops/Wheat/2---Wheat-Sprout.png',
      'assets/Sprites/Crops/Wheat/3---Wheat-Mid.png',
      'assets/Sprites/Crops/Wheat/4---Wheat-Full.png',
    ],
    nectar: {
      producesNectar: true,
      nectarAmount: 75,
      nectarQuality: 80,
      honeyProfile: {
        type: 'light',
        flavor: 'floral',
        color: '#F7E7A1',
        description: 'Delicate, light honey with sweet floral notes from large pumpkin blossoms'
      },
      pollen: {
        amount: 85,
        quality: 75,
        color: '#FFA500'
      },
      beeAttraction: 90,
      peakNectarHours: [6, 10]
    },
  },
  wheat: {
    id: 'wheat',
    name: 'Wheat',
    category: 'grain',
    emoji: '🌾',
    plantRequirement: {
      type: 'seed',
      amount: 1,
    },
    harvestYield: {
      crop: { min: 1, max: 2 },
      seeds: { min: 2, max: 4 }, // Grains produce lots of seeds
    },
    sellPrice: 8,
    growthImages: [
      'assets/Sprites/Crops/Wheat/1---Wheat-Seed.png',
      'assets/Sprites/Crops/Wheat/2---Wheat-Sprout.png',
      'assets/Sprites/Crops/Wheat/3---Wheat-Mid.png',
      'assets/Sprites/Crops/Wheat/4---Wheat-Full.png',
    ],
    nectar: {
      producesNectar: false, // Wheat is wind-pollinated
      nectarAmount: 0,
      nectarQuality: 0,
      honeyProfile: {
        type: 'light',
        flavor: 'mild',
        color: '#F5F5DC',
        description: 'No honey production - wheat is wind-pollinated and produces no nectar'
      },
      pollen: {
        amount: 15, // Some pollen but not useful for bees
        quality: 20,
        color: '#F4E4A6'
      },
      beeAttraction: 5,
      peakNectarHours: [0, 0]
    },
  },
  potato: {
    id: 'potato',
    name: 'Potato',
    category: 'vegetable',
    emoji: '🥔',
    plantRequirement: {
      type: 'seed',
      amount: 1,
    },
    harvestYield: {
      crop: { min: 2, max: 3 },
      seeds: undefined,
    },
    sellPrice: 10,
    growthImages: [
      'assets/Sprites/Crops/Wheat/1---Wheat-Seed.png',
      'assets/Sprites/Crops/Wheat/2---Wheat-Sprout.png',
      'assets/Sprites/Crops/Wheat/3---Wheat-Mid.png',
      'assets/Sprites/Crops/Wheat/4---Wheat-Full.png',
    ],
    nectar: {
      producesNectar: true,
      nectarAmount: 40,
      nectarQuality: 55,
      honeyProfile: {
        type: 'light',
        flavor: 'mild',
        color: '#F8E8B8',
        description: 'Light, clean honey with a subtle earthy undertone from potato flowers'
      },
      pollen: {
        amount: 50,
        quality: 60,
        color: '#FFEB3B'
      },
      beeAttraction: 45,
      peakNectarHours: [9, 14]
    },
  },
  sunflower: {
    id: 'sunflower',
    name: 'Sunflower',
    category: 'flower',
    emoji: '🌻',
    plantRequirement: {
      type: 'seed',
      amount: 1,
    },
    harvestYield: {
      crop: { min: 1, max: 1 },
      seeds: { min: 2, max: 3 },
    },
    sellPrice: 20,
    growthImages: [
      'assets/Sprites/Crops/Wheat/1---Wheat-Seed.png',
      'assets/Sprites/Crops/Wheat/2---Wheat-Sprout.png',
      'assets/Sprites/Crops/Wheat/3---Wheat-Mid.png',
      'assets/Sprites/Crops/Wheat/4---Wheat-Full.png',
    ],
    nectar: {
      producesNectar: true,
      nectarAmount: 95,
      nectarQuality: 90,
      honeyProfile: {
        type: 'amber',
        flavor: 'distinctive',
        color: '#FFB300',
        description: 'Golden amber honey with a rich, distinctive flavor and bright yellow color from sunflower nectar'
      },
      pollen: {
        amount: 95,
        quality: 90,
        color: '#FFD700'
      },
      beeAttraction: 100,
      peakNectarHours: [7, 15]
    },
  },
};

/**
 * Get crop configuration by ID
 */
export function getCropConfig(cropId: string): CropConfig | undefined {
  return CROP_CONFIGS[cropId];
}

/**
 * Check if player can plant a crop
 */
export function canPlantCrop(cropId: string, inventory: any): boolean {
  const config = getCropConfig(cropId);
  if (!config) return false;

  if (config.plantRequirement.type === 'seed') {
    return (inventory.seeds[cropId] || 0) >= config.plantRequirement.amount;
  } else {
    return (inventory.harvested[cropId] || 0) >= config.plantRequirement.amount;
  }
}

/**
 * Get a random number between min and max (inclusive)
 */
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Calculate harvest rewards for a crop
 */
export function calculateHarvestRewards(cropId: string): {
  crops: number;
  seeds: number;
} {
  const config = getCropConfig(cropId);
  if (!config) {
    return { crops: 0, seeds: 0 };
  }

  const crops = randomBetween(config.harvestYield.crop.min, config.harvestYield.crop.max);
  const seeds = config.harvestYield.seeds 
    ? randomBetween(config.harvestYield.seeds.min, config.harvestYield.seeds.max)
    : 0;

  return { crops, seeds };
}

/**
 * Get all crops that produce nectar (attractive to bees)
 */
export function getNectarProducingCrops(): CropConfig[] {
  return Object.values(CROP_CONFIGS).filter(crop => crop.nectar.producesNectar);
}

/**
 * Calculate nectar production for a crop at a specific time
 */
export function calculateNectarProduction(cropId: string, currentHour: number): number {
  const config = getCropConfig(cropId);
  if (!config || !config.nectar.producesNectar) {
    return 0;
  }

  const [peakStart, peakEnd] = config.nectar.peakNectarHours;
  let timeMultiplier = 1;

  // Calculate time-based nectar production multiplier
  if (currentHour >= peakStart && currentHour <= peakEnd) {
    timeMultiplier = 1.5; // Peak production
  } else {
    // Gradual falloff from peak hours
    const distanceFromPeak = Math.min(
      Math.abs(currentHour - peakStart),
      Math.abs(currentHour - peakEnd)
    );
    timeMultiplier = Math.max(0.3, 1 - (distanceFromPeak * 0.1));
  }

  return config.nectar.nectarAmount * timeMultiplier;
}

/**
 * Get honey blend information from multiple crop sources
 */
export function calculateHoneyBlend(cropSources: { [cropId: string]: number }): {
  dominantHoney: CropConfig['nectar']['honeyProfile'];
  blendDescription: string;
  averageQuality: number;
} {
  const crops = Object.entries(cropSources)
    .map(([cropId, amount]) => ({ config: getCropConfig(cropId), amount }))
    .filter(({ config }) => config && config.nectar.producesNectar);

  if (crops.length === 0) {
    return {
      dominantHoney: {
        type: 'light',
        flavor: 'mild',
        color: '#F5E6A8',
        description: 'No nectar sources available'
      },
      blendDescription: 'No active nectar production',
      averageQuality: 0
    };
  }

  // Find dominant source (highest amount)
  const dominant = crops.reduce((prev, curr) => 
    curr.amount > prev.amount ? curr : prev
  );

  // Calculate average quality
  const totalAmount = crops.reduce((sum, { amount }) => sum + amount, 0);
  const averageQuality = crops.reduce((sum, { config, amount }) => 
    sum + (config!.nectar.nectarQuality * (amount / totalAmount)), 0
  );

  // Create blend description
  const sourceNames = crops
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3)
    .map(({ config }) => config!.name)
    .join(', ');

  const blendDescription = crops.length === 1 
    ? `Pure ${dominant.config!.name.toLowerCase()} honey`
    : `Wildflower blend from ${sourceNames}${crops.length > 3 ? ' and others' : ''}`;

  return {
    dominantHoney: dominant.config!.nectar.honeyProfile,
    blendDescription,
    averageQuality
  };
}
