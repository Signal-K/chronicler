import type { MoonAstronomyData, StarVisibility, SunData } from '../lib/astronomy';
import type { WeatherData } from '../lib/weather';

export interface BeeData {
  id: number;
  x: number;
  y: number;
  direction?: number;
  targetX?: number;
  targetY?: number;
}

export interface PollenDrop {
  id: number;
  x: number;
  y: number;
  createdAt: number;
}

export interface PollinationIndicator {
  id: string;
  x: number;
  y: number;
  plot1: number;
  plot2: number;
}

export interface BeesProps {
  bees: BeeData[];
  beesActive: boolean;
  sunData: SunData | null;
  weatherData: WeatherData | null;
  fullyGrownPlantCount: number;
  fullyGrownPlantPositions: { x: number; y: number; plotId: number }[];
  onPollinationPress?: (plot1: number, plot2: number) => void; // Optional - legacy classification feature
}

export interface Star {
  x: number;
  y: number;
  magnitude: number;
  size: number;
  visible: boolean;
}

export interface StarsProps {
  starVisibility: StarVisibility | null;
  starField: Star[];
}

export interface CloudData {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
}

export interface CloudsProps {
  clouds: CloudData[];
  cloudOffset: number;
}

export type ToolType = 'till' | 'grass' | 'lilac' | 'watering-can' | 'shovel' | null;

export interface PlantingToolbarProps {
  onToolSelect: (tool: ToolType) => void;
  showTill?: boolean;
  toolbarTop?: number;
}

export interface GardenPlotsProps {
  showFlowers: boolean;
  selectedTool: ToolType;
  plotStates: {
    [key: number]: {
      watered: boolean;
      planted: boolean;
      wateredAt?: number;
      tilled?: boolean;
      plantedAt?: number;
      growthStage?: number;
      needsWater?: boolean;
    };
  };
  onPlotPress: (plotId: number) => void;
}

export interface MoonProps {
  moonData: MoonAstronomyData | null;
  sunData: SunData | null;
}

export interface WeatherHUDProps {
  weather: string;
  weatherData: WeatherData | null;
  userEmail: string;
  currentPlanet: string;
  calculateGrowthRate: (temperature: number, humidity: number, planetName: string) => { rate: number; description: string };
}

export interface ToolbarIconProps {
  icon: string;
  label: string;
  isSelected: boolean;
  onPress: () => void;
}
