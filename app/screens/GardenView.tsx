import Bees from '@/components/garden/Bees';
import Clouds from '@/components/garden/Clouds';
import GardenPlots from '@/components/garden/GardenPlots';
import GrassTerrain from '@/components/garden/GrassTerrain';
import Moon from '@/components/garden/Moon';
import PlantingToolbar, { ToolType } from '@/components/garden/PlantingToolbar';
import Stars from '@/components/garden/Stars';
import WeatherHUD from '@/components/garden/WeatherHUD';
import PlanetIcon from '@/components/PlanetIcon';
import { generateStarField, getMoonAstronomyData, getStarVisibility, getSunData, getTimeOfDay, MoonAstronomyData, shouldBeesBeActive, StarVisibility, SunData } from '@/lib/astronomy';
import { supabase } from '@/lib/supabase';
import { getCurrentWeather, getSkyColors, WeatherData } from '@/lib/weather';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { gardenViewStyles as styles } from '../../styles/screens/GardenViewStyles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface CloudData {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
}

interface BeeData {
  id: number;
  x: number;
  y: number;
  direction: number;
}

export default function GardenView() {
  const params = useLocalSearchParams();
  const [userEmail, setUserEmail] = useState<string>('');
  const [weather, setWeather] = useState<string>('Loading...');
  const [cloudOffset, setCloudOffset] = useState<number>(0);
  const [currentPlanet, setCurrentPlanet] = useState<string>('Earth');

  const [showFlowers, setShowFlowers] = useState<boolean>(true);
  
  // Weather and astronomy data
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [sunData, setSunData] = useState<SunData | null>(null);
  const [moonData, setMoonData] = useState<MoonAstronomyData | null>(null);
  const [starVisibility, setStarVisibility] = useState<StarVisibility | null>(null);
  const [starField, setStarField] = useState<{
    x: number;
    y: number;
    magnitude: number;
    size: number;
    visible: boolean;
  }[]>([]);
  const [skyColors, setSkyColors] = useState({ primary: '#87CEEB', secondary: '#B0E0E6' });
  const [beesActive, setBeesActive] = useState(true);
  
  // Animation values
  const animationFrame = useRef<number | null>(null);
  
  // Static data for now (future: from Supabase)
  const [clouds] = useState<CloudData[]>([
    { id: 1, x: -100, y: 50, speed: 0.5, size: 60 },
    { id: 2, x: screenWidth + 50, y: 120, speed: 0.3, size: 80 },
    { id: 3, x: screenWidth * 0.5, y: 80, speed: 0.4, size: 70 },
  ]);

  const handleToolSelect = (tool: ToolType) => {
    // Tool selection is managed by the PlantingToolbar component itself
    setShowFlowers(tool === null);
    console.log('Selected tool:', tool);
  };
  
  const [bees] = useState<BeeData[]>([
    { id: 1, x: screenWidth * 0.3, y: screenHeight * 0.4, direction: 1 },
    { id: 2, x: screenWidth * 0.7, y: screenHeight * 0.6, direction: -1 },
    { id: 3, x: screenWidth * 0.2, y: screenHeight * 0.3, direction: 1 },
    { id: 4, x: screenWidth * 0.8, y: screenHeight * 0.5, direction: -1 },
    { id: 5, x: screenWidth * 0.5, y: screenHeight * 0.35, direction: 1 },
  ]);

  // Get user session on mount
  useEffect(() => {
    const getUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserEmail(session.user.email || 'Anonymous');
      } else {
        setUserEmail('Guest User');
      }
    };
    getUserSession();
  }, []);

  // Set current planet from route parameters
  useEffect(() => {
    if (params.planetName && typeof params.planetName === 'string') {
      setCurrentPlanet(params.planetName);
    }
  }, [params.planetName]);

  // Get location and determine weather/astronomy data
  useEffect(() => {
    const getLocationAndData = async () => {
      try {
        let lat: number, lon: number;
        
        // Try to get user location, default to Port Melbourne if denied
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          try {
            const currentLocation = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
            lat = currentLocation.coords.latitude;
            lon = currentLocation.coords.longitude;
          } catch (locationError) {
            console.log('Unable to get location, using Port Melbourne as default:', locationError);
            lat = -37.8406;
            lon = 144.9631;
          }
        } else {
          console.log('Location permission denied, using Port Melbourne as default');
          lat = -37.8406;
          lon = 144.9631;
        }

        // Get weather data
        let currentWeatherData: WeatherData | null = null;
        try {
          currentWeatherData = await getCurrentWeather(lat, lon);
          setWeatherData(currentWeatherData);
          setWeather(`${Math.round(currentWeatherData.temperature)}°C • ${currentWeatherData.description}`);
        } catch (weatherError) {
          console.warn('Failed to get weather data:', weatherError);
          setWeather('Port Melbourne • Clear');
        }

        // Get sun data
        const currentSunData = getSunData(new Date(), lat, lon);
        setSunData(currentSunData);

        // Get moon data
        const currentMoonData = getMoonAstronomyData(new Date(), lat, lon);
        setMoonData(currentMoonData);

        // Calculate time of day and sky colors
        const timeOfDay = getTimeOfDay(currentSunData);
        const cloudCover = currentWeatherData?.cloudCover || 20;
        const colors = getSkyColors(currentWeatherData || { 
          temperature: 20, 
          cloudCover: 20, 
          isStorm: false, 
          isRaining: false,
          weatherCondition: 'Clear'
        } as WeatherData, timeOfDay);
        setSkyColors(colors);

        // Calculate star visibility
        const visibility = getStarVisibility(currentSunData, currentMoonData, cloudCover);
        setStarVisibility(visibility);

        // Generate star field
        const stars = generateStarField(150, visibility);
        setStarField(stars);

        // Check if bees should be active
        const temperature = currentWeatherData?.temperature || 20;
        const windSpeed = currentWeatherData?.windSpeed || 5;
        const active = shouldBeesBeActive(currentSunData, temperature, windSpeed);
        setBeesActive(active);

      } catch (error) {
        console.error('Error getting location and data:', error);
        setWeather('Port Melbourne • Unable to get data');
        
        // Use fallback data for Port Melbourne
        const fallbackSunData = getSunData(new Date(), -37.8406, 144.9631);
        setSunData(fallbackSunData);
        const fallbackTimeOfDay = getTimeOfDay(fallbackSunData);
        const fallbackColors = getSkyColors({
          temperature: 20,
          cloudCover: 20,
          isStorm: false,
          isRaining: false,
          weatherCondition: 'Clear'
        } as WeatherData, fallbackTimeOfDay);
        setSkyColors(fallbackColors);
      }
    };

    getLocationAndData();
    
    // Update data every 5 minutes
    const interval = setInterval(getLocationAndData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate plant growth rate based on temperature, humidity, and planet
  const calculateGrowthRate = (temperature: number, humidity: number, planetName: string): { rate: number; description: string } => {
    let baseRate = 100; // Start with 100% base growth rate
    
    // Temperature factor (optimal range: 18-25°C)
    let tempFactor = 1;
    if (temperature < 5) {
      tempFactor = 0.1; // Too cold, minimal growth
    } else if (temperature < 10) {
      tempFactor = 0.3; // Cold, slow growth
    } else if (temperature < 18) {
      tempFactor = 0.5 + (temperature - 10) * 0.05; // Gradually improving
    } else if (temperature <= 25) {
      tempFactor = 1; // Optimal temperature range
    } else if (temperature <= 30) {
      tempFactor = 1 - (temperature - 25) * 0.1; // Getting too hot
    } else if (temperature <= 35) {
      tempFactor = 0.5 - (temperature - 30) * 0.05; // Very hot, declining
    } else {
      tempFactor = 0.2; // Extreme heat, very poor growth
    }
    
    // Humidity factor (optimal range: 40-70%)
    let humidityFactor = 1;
    if (humidity < 20) {
      humidityFactor = 0.3; // Too dry
    } else if (humidity < 40) {
      humidityFactor = 0.5 + (humidity - 20) * 0.025; // Improving
    } else if (humidity <= 70) {
      humidityFactor = 1; // Optimal humidity range
    } else if (humidity <= 85) {
      humidityFactor = 1 - (humidity - 70) * 0.02; // Getting too humid
    } else {
      humidityFactor = 0.7; // Too humid, but not as bad as too dry
    }
    
    // Planet factor - 90% penalty for non-Earth planets
    const planetFactor = planetName.toLowerCase() === 'earth' ? 1 : 0.1;
    
    // Calculate final growth rate
    const finalRate = Math.round(baseRate * tempFactor * humidityFactor * planetFactor);
    
    // Determine description
    let description = '';
    if (finalRate >= 90) {
      description = 'Excellent';
    } else if (finalRate >= 70) {
      description = 'Good';
    } else if (finalRate >= 50) {
      description = 'Moderate';
    } else if (finalRate >= 30) {
      description = 'Poor';
    } else if (finalRate >= 10) {
      description = 'Very Poor';
    } else {
      description = 'Minimal';
    }
    
    return { rate: finalRate, description };
  };

  // Cloud animation
  useEffect(() => {
    const animate = () => {
      setCloudOffset((prev) => (prev + 0.5) % (screenWidth + 200));
      animationFrame.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  const handlePlanetsPress = () => {
    router.push('/planets');
  };

  const handleIdentifyPress = () => {
    Alert.alert('Identify', 'Plant identification coming soon!');
  };

  const handlePlanetPress = () => {
    router.push('/settings');
  };

  return (
    <View style={[styles.container, { backgroundColor: skyColors.primary }]}>
      <StatusBar style="dark" />
      
      {/* Layered background using CSS-style positioning */}
      <View style={styles.backgroundContainer}>
        {/* Dynamic sky background */}
        <View style={[styles.sky, { backgroundColor: skyColors.primary }]} />
        <View style={[styles.skyGradient, { backgroundColor: skyColors.secondary }]} />
        
        {/* Stars layer (only visible at night) */}
        <Stars starVisibility={starVisibility} starField={starField} />
        
        {/* Moon layer */}
        <Moon moonData={moonData} sunData={sunData} />
        
        {/* Clouds layer */}
        <Clouds clouds={clouds} cloudOffset={cloudOffset} />

        {/* Grass terrain strip (foreground) - covers bottom 45% */}
        <GrassTerrain />
        
        {/* Garden plots and flowers */}
        <GardenPlots showFlowers={showFlowers} />

        {/* Bees */}
        <Bees 
          bees={bees} 
          beesActive={beesActive} 
          sunData={sunData} 
          weatherData={weatherData} 
        />

        <PlantingToolbar onToolSelect={handleToolSelect} />
      </View>

      {/* HUD Overlay */}
      <WeatherHUD 
        weather={weather}
        weatherData={weatherData}
        userEmail={userEmail}
        currentPlanet={currentPlanet}
        calculateGrowthRate={calculateGrowthRate}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={handlePlanetsPress}>
          <View style={styles.navIconContainer}>
            <PlanetIcon size={28} color="#4A90E2" />
          </View>
          <Text style={styles.navText}>Planets</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton} onPress={handleIdentifyPress}>
          <Text style={styles.navIcon}>🔍</Text>
          <Text style={styles.navText}>Identify</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton} onPress={handlePlanetPress}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}