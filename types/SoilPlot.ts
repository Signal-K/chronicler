export type SoilPlotProps = {
    plot: PlotState;
    onClick: () => void;
    selectedTool: Tool
};

export type Tool = "water" | "till" | "plant" | null
export type PlotState = {
  tilled: boolean
  watered: boolean
  crop: string | null
  growthStage: number // 0 = no crop, 1-3 = growth stages, 4 = ready to harvest
  plantedAt: number | null
  lastWateredAt: number | null
  needsWater: boolean
};