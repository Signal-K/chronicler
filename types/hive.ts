// Beehive type definitions - simplified for single hive system

export interface HiveData {
  id: string;
  beeCount: number;        // Number of bees in the hive (starts at 0)
  createdAt: number;       // Timestamp when hive was created
}

// Legacy interface (keeping for compatibility with existing components)
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