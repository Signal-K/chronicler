export interface Plant {
  type: 'grass';
  stage: 0 | 1 | 2;
  plantedAt: number;
  lastWateredAt: number;
  needsWater: boolean;
}

export interface Plot {
  id: string;
  x: number;
  y: number;
  isTilled: boolean;
  plant?: Plant;
}

export interface PlantComponentProps {
  plant: Plant;
  onWater?: () => void;
}

export interface PlotComponentProps {
  plot: Plot;
  selectedTool: 'grass' | null;
  onPlant: (plotId: string) => void;
  onWater: (plotId: string) => void;
}
