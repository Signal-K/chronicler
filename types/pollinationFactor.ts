// Pollination Factor - tracks user's progress and determines bee spawning

export interface PollinationFactorData {
  factor: number;           // Current pollination factor (starts at 0)
  totalHarvests: number;    // Total harvests performed
  threshold: number;        // Threshold for bee spawning (default: 5)
}

export interface PollinationFactorHookReturn {
  pollinationFactor: PollinationFactorData;
  incrementFactor: (amount: number) => void;
  canSpawnBees: boolean;
}
