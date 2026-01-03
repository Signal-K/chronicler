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
  /** Growth stage images - require() of image files for each growth stage */
  growthImages: any[]; // [seed/sprout, young, mature, ready]
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
      require('../assets/Sprites/Crops/Wheat/1---Wheat-Seed.png'),
      require('../assets/Sprites/Crops/Wheat/2---Wheat-Sprout.png'),
      require('../assets/Sprites/Crops/Wheat/3---Wheat-Mid.png'),
      require('../assets/Sprites/Crops/Wheat/4---Wheat-Full.png'),
      require('../assets/Sprites/Crops/Tomato.png'),
    ],
    nectar: {
      producesNectar: true,
      nectarAmount: 15, // Very low - tomatoes are primarily self-pollinating
      nectarQuality: 40,
      honeyProfile: {
        type: 'light',
        flavor: 'mild',
        color: '#F8F0D0',
        description: 'Rare, very light honey with subtle green, vegetal notes - tomato plants provide minimal nectar'
      },
      pollen: {
        amount: 25, // Low pollen production
        quality: 45,
        color: '#FFF2AA'
      },
      beeAttraction: 25, // Low attraction - bees rarely visit tomato flowers
      peakNectarHours: [9, 11] // Short window, early morning
    },
  },
  blueberry: {
    id: 'blueberry',
    name: 'Blueberry',
    category: 'fruit',
    emoji: '🫐',
    plantRequirement: {
      type: 'seed',
      amount: 1,
    },
    harvestYield: {
      crop: { min: 1, max: 3 },
      seeds: { min: 0, max: 2 },
    },
    sellPrice: 14,
    growthImages: [
      require('../assets/Sprites/Crops/Wheat/1---Wheat-Seed.png'),
      require('../assets/Sprites/Crops/Wheat/2---Wheat-Sprout.png'),
      require('../assets/Sprites/Crops/Wheat/3---Wheat-Mid.png'),
      require('../assets/Sprites/Crops/Wheat/4---Wheat-Full.png'),
      require('../assets/Sprites/Crops/Blueberry.png'),
    ],
    nectar: {
      producesNectar: true,
      nectarAmount: 75, // Blueberries are excellent nectar sources
      nectarQuality: 85,
      honeyProfile: {
        type: 'light',
        flavor: 'sweet',
        color: '#E8E0A8', // Light amber with slight berry tint
        description: 'Premium light honey with delicate berry undertones and buttery texture from blueberry blossoms'
      },
      pollen: {
        amount: 70,
        quality: 80,
        color: '#E6D5FF' // Blueberry pollen has a slight purple tint
      },
      beeAttraction: 90, // Blueberries are very attractive to bees
      peakNectarHours: [6, 12] // Early morning peak production
    },
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender',
    category: 'flower',
    emoji: '🌸',
    plantRequirement: {
      type: 'seed',
      amount: 1,
    },
    harvestYield: {
      crop: { min: 1, max: 1 },
      seeds: { min: 1, max: 2 },
    },
    sellPrice: 18,
    growthImages: [
      require('../assets/Sprites/Crops/Wheat/1---Wheat-Seed.png'),
      require('../assets/Sprites/Crops/Wheat/2---Wheat-Sprout.png'),
      require('../assets/Sprites/Crops/Wheat/3---Wheat-Mid.png'),
      require('../assets/Sprites/Crops/Wheat/4---Wheat-Full.png'),
      require('../assets/Sprites/Crops/Lavender.png'),
    ],
    nectar: {
      producesNectar: true,
      nectarAmount: 85,
      nectarQuality: 98,
      honeyProfile: {
        type: 'specialty',
        flavor: 'floral',
        color: '#F5F0D8', // Very light, almost white with lavender hints
        description: 'Exquisite monofloral honey with intense lavender aroma, delicate floral taste, and therapeutic properties'
      },
      pollen: {
        amount: 80,
        quality: 95,
        color: '#D8D0FF' // Light purple pollen
      },
      beeAttraction: 100, // Maximum attraction - lavender is beloved by bees
      peakNectarHours: [8, 16] // Long nectar production window
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
      require('../assets/Sprites/Crops/Wheat/1---Wheat-Seed.png'),
      require('../assets/Sprites/Crops/Wheat/2---Wheat-Sprout.png'),
      require('../assets/Sprites/Crops/Wheat/3---Wheat-Mid.png'),
      require('../assets/Sprites/Crops/Wheat/4---Wheat-Full.png'),
      require('../assets/Sprites/Crops/Sunflower.png'),
    ],
    nectar: {
      producesNectar: true,
      nectarAmount: 95,
      nectarQuality: 88,
      honeyProfile: {
        type: 'amber',
        flavor: 'robust',
        color: '#FFD700', // Bright golden yellow
        description: 'Bold golden honey with rich, nutty flavor and quick crystallization - prized for its distinctive sunflower taste'
      },
      pollen: {
        amount: 100, // Sunflowers produce massive amounts of pollen
        quality: 85,
        color: '#FFA500' // Orange-yellow sunflower pollen
      },
      beeAttraction: 100, // Maximum attraction - sunflowers are bee magnets
      peakNectarHours: [8, 14] // Peak during sunny morning hours
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
