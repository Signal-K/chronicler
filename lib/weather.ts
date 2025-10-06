import axios from 'axios';

// OpenWeather API configuration
const OPENWEATHER_API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual API key
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Default location: Port Melbourne, Victoria, Australia
const DEFAULT_LOCATION = {
  lat: -37.8406,
  lon: 144.9631,
  name: 'Port Melbourne'
};

export interface WeatherData {
  temperature: number; // Celsius
  humidity: number; // Percentage
  pressure: number; // hPa
  cloudCover: number; // Percentage (0-100)
  visibility: number; // Meters
  uvIndex: number;
  windSpeed: number; // m/s
  windDirection: number; // Degrees
  weatherCondition: string; // Main weather condition
  description: string; // Detailed description
  isStorm: boolean; // Thunder/lightning present
  isRaining: boolean;
  isSnowing: boolean;
  location: {
    lat: number;
    lon: number;
    name: string;
  };
  timestamp: number;
}

export interface MoonData {
  phase: number; // 0-1 (0 = new moon, 0.5 = full moon)
  illumination: number; // Percentage illuminated
  age: number; // Days since new moon
  distance: number; // km from Earth
  angularDiameter: number; // arc minutes
}

/**
 * Get current weather data for a location
 */
export async function getCurrentWeather(lat?: number, lon?: number): Promise<WeatherData> {
  const latitude = lat ?? DEFAULT_LOCATION.lat;
  const longitude = lon ?? DEFAULT_LOCATION.lon;
  
  try {
    const response = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: OPENWEATHER_API_KEY,
        units: 'metric' // Use Celsius
      }
    });

    const data = response.data;
    
    // Get UV Index data separately (requires different endpoint)
    const uvResponse = await axios.get(`${OPENWEATHER_BASE_URL}/uvi`, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: OPENWEATHER_API_KEY
      }
    }).catch(() => ({ data: { value: 0 } })); // Fallback if UV data unavailable

    const weatherCondition = data.weather[0].main.toLowerCase();
    const description = data.weather[0].description.toLowerCase();

    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      cloudCover: data.clouds.all,
      visibility: data.visibility,
      uvIndex: uvResponse.data.value || 0,
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg || 0,
      weatherCondition: data.weather[0].main,
      description: data.weather[0].description,
      isStorm: weatherCondition.includes('thunder') || description.includes('thunder'),
      isRaining: weatherCondition.includes('rain') || description.includes('rain'),
      isSnowing: weatherCondition.includes('snow') || description.includes('snow'),
      location: {
        lat: latitude,
        lon: longitude,
        name: data.name || DEFAULT_LOCATION.name
      },
      timestamp: Date.now()
    };
  } catch (error) {
    console.warn('Failed to fetch weather data, using mock data:', error);
    
    // Return mock data if API fails
    return getMockWeatherData(latitude, longitude);
  }
}

/**
 * Get moon phase data from a free astronomy API
 */
export async function getMoonPhase(lat?: number, lon?: number): Promise<MoonData> {
  const latitude = lat ?? DEFAULT_LOCATION.lat;
  const longitude = lon ?? DEFAULT_LOCATION.lon;
  
  try {
    // Using ipgeolocation.io moon phase API (has free tier)
    const response = await axios.get('https://api.ipgeolocation.io/astronomy', {
      params: {
        apiKey: 'YOUR_IPGEOLOCATION_API_KEY', // Replace with your key
        lat: latitude,
        long: longitude
      }
    });

    const moonPhase = response.data.moon_phase;
    
    // Convert moon phase name to numeric value
    const phaseValue = convertMoonPhaseToNumber(moonPhase);
    
    return {
      phase: phaseValue,
      illumination: parseFloat(response.data.moon_illumination) || 50,
      age: 0, // Would need additional calculation
      distance: 384400, // Average distance to moon in km
      angularDiameter: 31 // Average angular diameter in arc minutes
    };
  } catch (error) {
    console.warn('Failed to fetch moon data, using calculated data:', error);
    
    // Fallback to basic lunar cycle calculation
    return getCalculatedMoonPhase();
  }
}

/**
 * Convert moon phase name to numeric value (0-1)
 */
function convertMoonPhaseToNumber(phaseName: string): number {
  const phase = phaseName.toLowerCase();
  
  if (phase.includes('new')) return 0;
  if (phase.includes('waxing crescent')) return 0.125;
  if (phase.includes('first quarter')) return 0.25;
  if (phase.includes('waxing gibbous')) return 0.375;
  if (phase.includes('full')) return 0.5;
  if (phase.includes('waning gibbous')) return 0.625;
  if (phase.includes('last quarter') || phase.includes('third quarter')) return 0.75;
  if (phase.includes('waning crescent')) return 0.875;
  
  return 0.5; // Default to full moon
}

/**
 * Calculate moon phase based on lunar cycle (fallback method)
 */
function getCalculatedMoonPhase(): MoonData {
  const now = new Date();
  const knownNewMoon = new Date('2024-01-11'); // A known new moon date
  const lunarCycle = 29.53059; // Average lunar cycle in days
  
  const daysSinceNewMoon = (now.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const cyclesElapsed = daysSinceNewMoon / lunarCycle;
  const currentCycle = cyclesElapsed - Math.floor(cyclesElapsed);
  
  // Calculate illumination percentage
  const illumination = Math.round(50 * (1 - Math.cos(2 * Math.PI * currentCycle)));
  
  return {
    phase: currentCycle,
    illumination: illumination,
    age: Math.round(currentCycle * lunarCycle),
    distance: 384400,
    angularDiameter: 31
  };
}

/**
 * Mock weather data for testing/fallback
 */
function getMockWeatherData(lat: number, lon: number): WeatherData {
  const hour = new Date().getHours();
  
  // Create realistic mock data based on time of day
  const baseTemp = 20;
  const tempVariation = Math.sin((hour - 6) * Math.PI / 12) * 8;
  
  return {
    temperature: Math.round(baseTemp + tempVariation),
    humidity: 65,
    pressure: 1013,
    cloudCover: Math.random() * 100,
    visibility: 10000,
    uvIndex: hour > 6 && hour < 18 ? Math.max(0, Math.sin((hour - 6) * Math.PI / 12) * 10) : 0,
    windSpeed: 3 + Math.random() * 5,
    windDirection: Math.random() * 360,
    weatherCondition: 'Clear',
    description: 'clear sky',
    isStorm: false,
    isRaining: false,
    isSnowing: false,
    location: {
      lat,
      lon,
      name: DEFAULT_LOCATION.name
    },
    timestamp: Date.now()
  };
}

/**
 * Get cloud coverage category for sky rendering
 */
export function getCloudCategory(cloudCover: number): 'clear' | 'partly-cloudy' | 'cloudy' | 'overcast' {
  if (cloudCover < 10) return 'clear';
  if (cloudCover < 30) return 'partly-cloudy';
  if (cloudCover < 70) return 'cloudy';
  return 'overcast';
}

/**
 * Determine if it's a good day for bee activity
 */
export function isBeeWeather(weather: WeatherData): boolean {
  return (
    weather.temperature > 12 && // Bees are active above 12°C
    weather.temperature < 35 && // Too hot is bad for bees
    !weather.isStorm &&
    !weather.isRaining &&
    weather.windSpeed < 10 // Strong winds make flying difficult
  );
}

/**
 * Get weather-based sky colors
 */
export function getSkyColors(weather: WeatherData, timeOfDay: 'dawn' | 'day' | 'dusk' | 'night'): {
  primary: string;
  secondary: string;
  accent?: string;
} {
  const cloudiness = weather.cloudCover / 100;
  
  if (weather.isStorm) {
    return {
      primary: '#2C3E50',
      secondary: '#34495E',
      accent: '#7F8C8D'
    };
  }
  
  switch (timeOfDay) {
    case 'dawn':
      return {
        primary: cloudiness > 0.5 ? '#95A5A6' : '#E74C3C',
        secondary: cloudiness > 0.5 ? '#BDC3C7' : '#F39C12',
        accent: '#F1C40F'
      };
    case 'day':
      return {
        primary: cloudiness > 0.7 ? '#95A5A6' : '#3498DB',
        secondary: cloudiness > 0.7 ? '#BDC3C7' : '#87CEEB'
      };
    case 'dusk':
      return {
        primary: cloudiness > 0.5 ? '#7F8C8D' : '#E67E22',
        secondary: cloudiness > 0.5 ? '#95A5A6' : '#D35400',
        accent: '#8E44AD'
      };
    case 'night':
      return {
        primary: cloudiness > 0.8 ? '#2C3E50' : '#1A1A2E',
        secondary: cloudiness > 0.8 ? '#34495E' : '#16213E'
      };
    default:
      return {
        primary: '#3498DB',
        secondary: '#87CEEB'
      };
  }
}