// Beehive type definitions - simplified for single hive system

export type BeeHealth = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

export type HiveType = 'standard' | 'advanced' | 'premium' | 'langstroth' | 'top-bar' | 'warre' | 'flow';

export interface HarvestRecord {
  cropId: string;
  timestamp: number;
  amount: number;
  halved?: boolean; // Track if this harvest was halved after bottling
}

export interface HoneyProduction {
  currentCapacity: number; // Current honey capacity (0-100)
  maxCapacity: number; // Maximum capacity (level-based)
  dailyHarvests: HarvestRecord[];
  lastBottledAt?: number;
  honeyBottles: number; // Number of bottles ready to collect
  dominantCrop?: string; // The crop that defines the honey type
  productionActive: boolean; // Whether bees are currently producing honey
  lastUpdate?: number; // Timestamp of last production update
}

export interface HoneyTypeInfo {
  type: 'light' | 'amber' | 'dark' | 'specialty';
  flavor: 'mild' | 'floral' | 'robust' | 'distinctive' | 'sweet' | 'complex';
  color: string;
  description: string;
  blendDescription: string;
  quality: number;
}

export interface BottleHoneyResult {
  updatedHive: HiveData;
  bottlesCollected: number;
  honeyType: HoneyTypeInfo | null;
}

export interface HiveResources {
  pollen: number;
};

export interface PollinationMilestone {
  score: number;
  timestamp: number;
  beesAwarded: number;
};

export interface HivePopulation {
  workers: number;
  drones: number;
  queen: boolean;
  brood: number;
}

export interface HiveInventory {
  availableHives: Record<string, number>;
  unlockedTypes: HiveType[];
}

export interface PollinatorQuality {
  overall: number;
  diversity: number;
  health: number;
  activity: number;
}

export interface HiveData {
  id: string;
  beeCount: number;        // Number of bees in the hive (starts at 0)
  createdAt: number;       // Timestamp when hive was created
  resources?: HiveResources; // Hive resources
  health?: BeeHealth;      // Bee health status
  population?: HivePopulation; // Detailed population breakdown
  status?: 'active' | 'dormant' | 'swarming';
  position?: { q: number; r: number; x?: number; y?: number; z?: number };
  lastMilestoneCheck?: number;
  maxCapacity?: number;
  honey?: HoneyProduction; // Honey production data
  level?: number;          // Hive level (affects capacity and production)
}

// Legacy interface (keeping for compatibility with existing components)
interface Hive {
  id: string;
  beeCount: number;
  health: number;
  pollinationPower: number;
  isActive: boolean;
}

export interface HiveCellProps {
  hive: Hive;
  isSelected: boolean;
}