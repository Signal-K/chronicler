// Beehive type definitions - simplified for single hive system

export type BeeHealth = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

export type HiveType = 'standard' | 'advanced' | 'premium' | 'langstroth' | 'top-bar' | 'warre' | 'flow';

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
}

// Legacy interface (keeping for compatibility with existing components)
export interface Hive {
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