import { useMemo } from 'react';
import type { BeeHealth, HiveData, PollinatorQuality } from '../types/hive';

interface UsePollinatorQualityProps {
  hives: HiveData[];
  weather?: {
    temperature: number;
    precipitation: number;
    windSpeed: number;
    condition: string;
  };
  season?: 'spring' | 'summer' | 'fall' | 'winter';
  airborneNectar?: number; // 0-100 scale from nearby flowering plants
}

export function usePollinatorQuality({
  hives,
  weather,
  season = 'spring',
  
}: UsePollinatorQualityProps): PollinatorQuality {
  
  const quality = useMemo(() => {
    // TODO: Implement pollinator quality calculation
    // This should calculate based on:
    // 1. Weather conditions (temperature, rain, wind)
    // 2. Total bee population across all hives
    // 3. Average bee health across hives
    // 5. Seasonal multipliers
    
    console.log('TODO: Calculate pollinator quality');
    console.log('Factors to consider:', { hives: hives.length, weather, season });
    
    // Skeleton implementation with placeholder values
    
    // Weather factor (0-100)
    const weatherFactor = calculateWeatherFactor(weather);
    
    // Population factor (0-100)
    const populationFactor = calculatePopulationFactor(hives);
    
    // Health factor (0-100)
    const healthFactor = calculateHealthFactor(hives);
    
    const resourceFactor = calculateResourceFactor(hives, 50);
    
    // Seasonality factor (0-100)
    const seasonalityFactor = calculateSeasonalityFactor(season);
    
    // Overall quality (weighted average)
    const overall = (
      weatherFactor * 0.25 +
      populationFactor * 0.25 +
      healthFactor * 0.20 +
      resourceFactor * 0.20 +
      seasonalityFactor * 0.10
    );
    
    return {
      overall: Math.max(0, Math.min(100, overall)),
      diversity: populationFactor, // Population diversity contributes to overall diversity
      health: healthFactor, // Bee health factor
      activity: (weatherFactor + seasonalityFactor + resourceFactor) / 3, // Activity based on weather, season, and resources
    };
  }, [hives, weather, season]);
  
  return quality;
}

function calculateWeatherFactor(weather?: UsePollinatorQualityProps['weather']): number {
  if (!weather) return 50; // Default neutral value
  
  let score = 50;
  
  // Temperature scoring (ideal: 15-27°C / 60-80°F)
  if (weather.temperature >= 15 && weather.temperature <= 27) {
    score += 25; // Perfect range
  } else if (weather.temperature >= 10 && weather.temperature <= 30) {
    score += 15; // Good range
  } else if (weather.temperature < 10 || weather.temperature > 30) {
    score -= 20; // Too cold or hot
  }
  
  if (weather.temperature < 5 || weather.temperature > 35) {
    score -= 30; // Extreme temps - bees won't fly
  }
  
  // Precipitation penalty (bees don't fly in rain)
  if (weather.precipitation === 0) {
    score += 15; // Perfect
  } else if (weather.precipitation < 20) {
    score += 5; // Light moisture ok
  } else if (weather.precipitation < 50) {
    score -= 15; // Rainy
  } else {
    score -= 30; // Heavy rain - no flying
  }
  
  // Wind penalty (bees struggle in wind)
  if (weather.windSpeed < 10) {
    score += 10; // Calm is good
  } else if (weather.windSpeed < 15) {
    // Neutral
  } else if (weather.windSpeed < 25) {
    score -= 15; // Windy
  } else {
    score -= 25; // Too windy to fly
  }
  
  // Weather condition bonus
  if (weather.condition === 'sunny' || weather.condition === 'clear') {
    score += 10;
  } else if (weather.condition === 'cloudy' || weather.condition === 'partly-cloudy') {
    // Neutral
  } else if (weather.condition === 'rainy' || weather.condition === 'stormy') {
    score -= 20;
  }
  
  return Math.max(0, Math.min(100, score));
}

// Calculate population contribution
function calculatePopulationFactor(hives: HiveData[]): number {
  if (hives.length === 0) return 0;
  
  const totalWorkers = hives.reduce((sum, h) => sum + (h.population?.workers || 0), 0);
  const totalDrones = hives.reduce((sum, h) => sum + (h.population?.drones || 0), 0);
  const hivesWithQueens = hives.filter(h => h.population?.queen).length;
  const avgBrood = hives.reduce((sum, h) => sum + (h.population?.brood || 0), 0) / hives.length;
  
  let score = 0;
  
  // Worker population (up to 40 points)
  // Ideal: 500-1000 workers per hive
  const avgWorkers = totalWorkers / hives.length;
  if (avgWorkers >= 500) {
    score += 40;
  } else if (avgWorkers >= 300) {
    score += 30;
  } else if (avgWorkers >= 100) {
    score += 20;
  } else {
    score += 10;
  }
  
  // Queen presence (up to 30 points)
  const queenRatio = hivesWithQueens / hives.length;
  score += queenRatio * 30;
  
  // Brood levels - future population (up to 20 points)
  if (avgBrood >= 80) {
    score += 20;
  } else if (avgBrood >= 50) {
    score += 15;
  } else if (avgBrood >= 30) {
    score += 10;
  } else {
    score += 5;
  }
  
  // Drone population - genetic diversity (up to 10 points)
  const avgDrones = totalDrones / hives.length;
  if (avgDrones >= 20) {
    score += 10;
  } else if (avgDrones >= 10) {
    score += 5;
  }
  
  return Math.max(0, Math.min(100, score));
}

// Calculate health contribution
function calculateHealthFactor(hives: HiveData[]): number {
  if (hives.length === 0) return 0;
  
  const healthScores: Record<BeeHealth, number> = {
    'excellent': 100,
    'good': 80,
    'fair': 50,
    'poor': 25,
    'critical': 10,
  };
  
  const avgHealth = hives.reduce((sum, h) => sum + healthScores[h.health || 'good'], 0) / hives.length;
  
  // Penalty if any hive is critical (diseased hives can spread)
  const criticalHives = hives.filter(h => h.health === 'critical').length;
  const criticalPenalty = criticalHives * 10;
  
  return Math.max(0, Math.min(100, Math.round(avgHealth - criticalPenalty)));
};

function calculateResourceFactor(hives: HiveData[], airborneNectar: number): number {
  if (hives.length === 0) return airborneNectar;
  
  const avgPollen = hives.reduce((sum, h) => sum + (h.resources?.pollen || 0), 0) / hives.length;
  
  const storedScore = (avgPollen * 0.5); // Nectar removed
  
  // Honey indicates colony health but less important for pollination activity
  
  // This is more important than stored resources for current pollination activity
  const environmentScore = airborneNectar;
  
  // Weighted combination: environment matters more for current pollination
  
  const combined = storedScore + 0 + 0; // airborneScore and honeyBonus removed
  return Math.round(Math.max(0, Math.min(100, combined)));
}

function calculateSeasonalityFactor(season: 'spring' | 'summer' | 'fall' | 'winter'): number {
  const seasonalScores = {
    spring: 85,  // High activity, lots of flowers blooming
    summer: 100, // Peak activity, maximum flowers and warm weather
    fall: 60,    // Moderate activity, preparing for winter, fewer flowers
    winter: 20,  // Low activity, survival mode, minimal foraging
  };
  
  return seasonalScores[season];
};

// Helper to get quality rating text
export function getQualityRating(overall: number): {
  rating: string;
  color: string;
  emoji: string;
} {
  if (overall >= 90) return { rating: 'Excellent', color: '#22c55e', emoji: '🌟' };
  if (overall >= 75) return { rating: 'Great', color: '#4ade80', emoji: '✨' };
  if (overall >= 60) return { rating: 'Good', color: '#86efac', emoji: '👍' };
  if (overall >= 40) return { rating: 'Fair', color: '#facc15', emoji: '⚠️' };
  if (overall >= 20) return { rating: 'Poor', color: '#fb923c', emoji: '⚠️' };
  return { rating: 'Critical', color: '#ef4444', emoji: '🚨' };
}
