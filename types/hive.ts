// Beehive type definitions

export type HiveType = 
  | 'standard'      // Basic wooden hive
  | 'langstroth'    // Traditional box hive
  | 'top-bar'       // Horizontal hive
  | 'warre'         // Vertical natural hive
  | 'flow'          // Modern flow hive
  | null;

export type BeeHealth = 
  | 'excellent'     // 90-100%
  | 'good'          // 70-89%
  | 'fair'          // 50-69%
  | 'poor'          // 30-49%
  | 'critical';     // 0-29%

export type HiveStatus = 
  | 'empty'         // No hive placed
  | 'active'        // Hive with bees
  | 'dormant'       // Winter/inactive
  | 'swarming'      // Bees preparing to leave
  | 'queenless';    // No queen present

export interface PollenNectarLevels {
  pollen: number;      // 0-100
  nectar: number;      // 0-100
  honey: number;       // 0-100 (processed nectar)
}

export interface BeePopulation {
  workers: number;     // Worker bees
  drones: number;      // Male bees
  queen: boolean;      // Has queen
  brood: number;       // Larvae/eggs (0-100)
}

export interface HiveData {
  id: string;
  position: { q: number; r: number }; // Hexagonal grid coordinates (axial)
  hiveType: HiveType;
  status: HiveStatus;
  health: BeeHealth;
  population: BeePopulation;
  resources: PollenNectarLevels;
  placedAt?: number;           // Timestamp when hive was placed
  lastHarvested?: number;      // Last honey harvest time
  temperature: number;         // Internal hive temp (affects bees)
  ventilation: number;         // 0-100 (affects health)
}

export interface PollinatorQuality {
  overall: number;             // 0-100 overall quality score
  factors: {
    weather: number;           // Weather contribution (0-100)
    population: number;        // Bee population contribution (0-100)
    health: number;            // Bee health contribution (0-100)
    resources: number;         // Pollen/nectar availability (0-100)
    seasonality: number;       // Time of year bonus/penalty (0-100)
  };
}

export interface HiveInventory {
  availableHives: {
    [key in Exclude<HiveType, null>]: number; // Count of each hive type in inventory
  };
  unlockedTypes: HiveType[];   // Which hive types user has unlocked
}

// Legacy interface (keeping for compatibility)
export interface Hive {
  id: string;
  beeCount: number;
  health: number;
  nectar: number;
  honey: number;
  pollinationPower: number;
  isActive: boolean;
}

export interface HiveCellProps {
  hive: Hive;
  isSelected: boolean;
}