import * as SunCalc from 'suncalc';

// Default location: Port Melbourne, Victoria, Australia
const DEFAULT_LOCATION = {
  lat: -37.8406,
  lon: 144.9631,
  name: 'Port Melbourne'
};

export interface SunData {
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  dawn: Date;
  dusk: Date;
  nauticalDawn: Date;
  nauticalDusk: Date;
  nightEnd: Date;
  night: Date;
  goldenHourEnd: Date;
  goldenHour: Date;
  elevation: number; // Current sun elevation in radians
  azimuth: number; // Current sun azimuth in radians
  elevationDegrees: number; // Current sun elevation in degrees
  azimuthDegrees: number; // Current sun azimuth in degrees
}

export interface MoonAstronomyData {
  rise: Date | null;
  set: Date | null;
  phase: number; // 0-1 (0 = new moon, 0.5 = full moon)
  illumination: number; // 0-1 (fraction illuminated)
  elevation: number; // Current moon elevation in radians
  azimuth: number; // Current moon azimuth in radians
  elevationDegrees: number; // Current moon elevation in degrees
  azimuthDegrees: number; // Current moon azimuth in degrees
  distance: number; // Distance to moon in km
  angularDiameter: number; // Angular diameter in degrees
  age: number; // Age of moon in days
  phaseName: string; // Human readable phase name
}

export interface StarVisibility {
  isVisible: boolean;
  magnitude: number; // Limiting magnitude (higher = more stars visible)
  transparency: number; // 0-1 atmospheric transparency
  lightPollution: number; // 0-1 light pollution factor
}

/**
 * Get comprehensive sun data for a location and time
 */
export function getSunData(date: Date = new Date(), lat?: number, lon?: number): SunData {
  const latitude = lat ?? DEFAULT_LOCATION.lat;
  const longitude = lon ?? DEFAULT_LOCATION.lon;
  
  // Get sun times for the date
  const times = SunCalc.getTimes(date, latitude, longitude);
  
  // Get current sun position
  const sunPos = SunCalc.getPosition(date, latitude, longitude);
  
  return {
    sunrise: times.sunrise,
    sunset: times.sunset,
    solarNoon: times.solarNoon,
    dawn: times.dawn,
    dusk: times.dusk,
    nauticalDawn: times.nauticalDawn,
    nauticalDusk: times.nauticalDusk,
    nightEnd: times.nightEnd,
    night: times.night,
    goldenHourEnd: times.goldenHourEnd,
    goldenHour: times.goldenHour,
    elevation: sunPos.altitude,
    azimuth: sunPos.azimuth,
    elevationDegrees: radiansToDegrees(sunPos.altitude),
    azimuthDegrees: radiansToDegrees(sunPos.azimuth)
  };
}

/**
 * Get comprehensive moon data for a location and time
 */
export function getMoonAstronomyData(date: Date = new Date(), lat?: number, lon?: number): MoonAstronomyData {
  const latitude = lat ?? DEFAULT_LOCATION.lat;
  const longitude = lon ?? DEFAULT_LOCATION.lon;
  
  // Get moon times for the date
  const moonTimes = SunCalc.getMoonTimes(date, latitude, longitude);
  
  // Get moon position
  const moonPos = SunCalc.getMoonPosition(date, latitude, longitude);
  
  // Get moon illumination
  const moonIllum = SunCalc.getMoonIllumination(date);
  
  // Calculate moon distance (approximate)
  const averageDistance = 384400; // km
  const distanceVariation = 1 + 0.1 * Math.sin(moonIllum.phase * 2 * Math.PI);
  const distance = averageDistance * distanceVariation;
  
  // Calculate angular diameter
  const angularDiameter = (1737.4 * 2) / distance * (180 / Math.PI); // Moon radius = 1737.4 km
  
  return {
    rise: moonTimes.rise || null,
    set: moonTimes.set || null,
    phase: moonIllum.phase,
    illumination: moonIllum.fraction,
    elevation: moonPos.altitude,
    azimuth: moonPos.azimuth,
    elevationDegrees: radiansToDegrees(moonPos.altitude),
    azimuthDegrees: radiansToDegrees(moonPos.azimuth),
    distance: Math.round(distance),
    angularDiameter: angularDiameter,
    age: moonIllum.phase * 29.53059, // Lunar cycle length
    phaseName: getMoonPhaseName(moonIllum.phase)
  };
}

/**
 * Get star visibility based on moon phase, sun position, and weather
 */
export function getStarVisibility(
  sunData: SunData,
  moonData: MoonAstronomyData,
  cloudCover: number = 0,
  lightPollution: number = 0.3 // 0 = dark sky, 1 = city center
): StarVisibility {
  const now = new Date();
  
  // Check if it's night time
  const isNight = now > sunData.sunset || now < sunData.sunrise;
  const isDarkNight = now > sunData.nauticalDusk || now < sunData.nauticalDawn;
  
  if (!isNight) {
    return {
      isVisible: false,
      magnitude: 0,
      transparency: 0,
      lightPollution
    };
  }
  
  // Calculate sky darkness based on sun elevation
  const sunDepression = Math.abs(sunData.elevationDegrees);
  let skyDarkness = 1;
  
  if (sunDepression < 6) {
    skyDarkness = 0; // Civil twilight
  } else if (sunDepression < 12) {
    skyDarkness = 0.3; // Nautical twilight
  } else if (sunDepression < 18) {
    skyDarkness = 0.7; // Astronomical twilight
  } else {
    skyDarkness = 1; // Full night
  }
  
  // Moon interference
  const moonInterference = moonData.elevation > 0 ? moonData.illumination * 0.5 : 0;
  
  // Atmospheric conditions
  const atmosphericTransparency = Math.max(0, 1 - (cloudCover / 100));
  
  // Calculate limiting magnitude (higher = more stars visible)
  const baseMagnitude = 6.5; // Perfect dark sky
  const magnitude = baseMagnitude * skyDarkness * atmosphericTransparency * (1 - lightPollution) * (1 - moonInterference);
  
  return {
    isVisible: isDarkNight && magnitude > 2,
    magnitude: Math.max(0, magnitude),
    transparency: atmosphericTransparency * skyDarkness,
    lightPollution
  };
}

/**
 * Determine time of day category
 */
export function getTimeOfDay(sunData: SunData): 'dawn' | 'day' | 'dusk' | 'night' {
  const now = new Date();
  
  if (now >= sunData.dawn && now <= sunData.goldenHourEnd) {
    return 'dawn';
  } else if (now > sunData.goldenHourEnd && now < sunData.goldenHour) {
    return 'day';
  } else if (now >= sunData.goldenHour && now <= sunData.dusk) {
    return 'dusk';
  } else {
    return 'night';
  }
}

/**
 * Check if bees should be active based on time and weather
 */
export function shouldBeesBeActive(sunData: SunData, temperature: number, windSpeed: number): boolean {
  const now = new Date();
  const timeOfDay = getTimeOfDay(sunData);
  
  // Bees are active during day and some twilight periods
  const rightTime = timeOfDay === 'day' || 
                   (timeOfDay === 'dawn' && now > sunData.goldenHourEnd) ||
                   (timeOfDay === 'dusk' && now < sunData.goldenHour);
  
  // Good weather conditions for bee activity
  const goodWeather = temperature > 12 && 
                     temperature < 35 && 
                     windSpeed < 10;
  
  return rightTime && goodWeather;
}

/**
 * Generate star field coordinates for rendering
 */
export function generateStarField(count: number = 200, visibility: StarVisibility): {
  x: number; // Screen x coordinate (0-1)
  y: number; // Screen y coordinate (0-1)
  magnitude: number; // Star brightness (0-1)
  size: number; // Visual size
  visible: boolean;
}[] {
  const stars: {
    x: number;
    y: number;
    magnitude: number;
    size: number;
    visible: boolean;
  }[] = [];
  
  for (let i = 0; i < count; i++) {
    // Generate random star position
    const x = Math.random();
    const y = Math.random() * 0.8; // Keep stars in upper 80% of screen
    
    // Star magnitude (brightness) follows realistic distribution
    const baseMagnitude = Math.random() * 6;
    const starVisible = visibility.isVisible && baseMagnitude <= visibility.magnitude;
    
    // Size based on brightness (brighter stars appear larger)
    const size = starVisible ? Math.max(1, (6 - baseMagnitude) * 0.5) : 0;
    
    // Brightness for rendering (0-1, inverted magnitude)
    const brightness = starVisible ? Math.max(0, 1 - (baseMagnitude / 6)) : 0;
    
    stars.push({
      x,
      y,
      magnitude: brightness * visibility.transparency,
      size,
      visible: starVisible
    });
  }
  
  return stars;
}

/**
 * Get moon phase name from phase value
 */
function getMoonPhaseName(phase: number): string {
  if (phase < 0.03 || phase > 0.97) return 'New Moon';
  if (phase < 0.22) return 'Waxing Crescent';
  if (phase < 0.28) return 'First Quarter';
  if (phase < 0.47) return 'Waxing Gibbous';
  if (phase < 0.53) return 'Full Moon';
  if (phase < 0.72) return 'Waning Gibbous';
  if (phase < 0.78) return 'Last Quarter';
  return 'Waning Crescent';
}

/**
 * Convert radians to degrees
 */
function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Calculate sunrise/sunset colors based on atmospheric conditions
 */
export function getSunsetColors(sunData: SunData, cloudCover: number): {
  primary: string;
  secondary: string;
  accent: string;
} {
  const timeOfDay = getTimeOfDay(sunData);
  const cloudiness = cloudCover / 100;
  
  if (timeOfDay === 'dawn') {
    // Dawn colors
    if (cloudiness > 0.7) {
      return {
        primary: '#FFB6C1', // Light pink
        secondary: '#FFA07A', // Light salmon
        accent: '#F0E68C' // Khaki
      };
    } else {
      return {
        primary: '#FF6347', // Tomato
        secondary: '#FFA500', // Orange
        accent: '#FFD700' // Gold
      };
    }
  } else if (timeOfDay === 'dusk') {
    // Sunset colors
    if (cloudiness > 0.7) {
      return {
        primary: '#DDA0DD', // Plum
        secondary: '#F0E68C', // Khaki
        accent: '#FF69B4' // Hot pink
      };
    } else {
      return {
        primary: '#FF4500', // Orange red
        secondary: '#FF8C00', // Dark orange
        accent: '#9370DB' // Medium purple
      };
    }
  }
  
  // Default blue sky
  return {
    primary: '#87CEEB', // Sky blue
    secondary: '#B0E0E6', // Powder blue
    accent: '#F0F8FF' // Alice blue
  };
}