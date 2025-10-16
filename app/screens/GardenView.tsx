import AlmanacModal from '@/components/almanac/AlmanacModal';
import Bees from '@/components/garden/Bees';
import Clouds from '@/components/garden/Clouds';
import GardenPlots from '@/components/garden/GardenPlots';
import GrassTerrain from '@/components/garden/GrassTerrain';
import Moon from '@/components/garden/Moon';
import PlantingToolbar from '@/components/garden/PlantingToolbar';
import Stars from '@/components/garden/Stars';
import WeatherHUD from '@/components/garden/WeatherHUD';
import PlanetIcon from '@/components/PlanetIcon';
import { generateStarField, getMoonAstronomyData, getStarVisibility, getSunData, getTimeOfDay, MoonAstronomyData, shouldBeesBeActive, StarVisibility, SunData } from '@/lib/astronomy';
import { supabase } from '@/lib/supabase';
import { addHarvestedPlant } from '@/lib/userStats';
import { DEBUG_FORCE_BEES_ACTIVE, getCurrentWeather, getSkyColors, WeatherData } from '@/lib/weather';
import type { BeeData, CloudData, ToolType } from '@/types/garden';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, Text, TouchableOpacity, View } from 'react-native';
import ClassificationModal from '../../components/actions/ClassificationModal';
import { gardenViewStyles as styles } from '../../styles/screens/GardenViewStyles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Plot positions array for cleaner code
const plotPositions = [
  { x: 40, y: screenHeight * 0.58, width: 120, height: 90 },
  { x: screenWidth * 0.3, y: screenHeight * 0.62, width: 120, height: 90 },
  { x: screenWidth * 0.6, y: screenHeight * 0.59, width: 120, height: 90 },
  { x: 60, y: screenHeight * 0.72, width: 120, height: 90 },
  { x: screenWidth * 0.4, y: screenHeight * 0.75, width: 120, height: 90 },
  { x: screenWidth * 0.75, y: screenHeight * 0.7, width: 120, height: 90 },
];

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;

export default function GardenView() {
  const params = useLocalSearchParams();
  const [userEmail, setUserEmail] = useState<string>('');
  const [weather, setWeather] = useState<string>('Loading...');
  const [cloudOffset, setCloudOffset] = useState<number>(0);
  const [currentPlanet, setCurrentPlanet] = useState<string>('Earth');

  const [showFlowers, setShowFlowers] = useState<boolean>(true);
  
  // Plot state management with timestamps
  const [selectedTool, setSelectedTool] = useState<ToolType>(null);
  const [plotStates, setPlotStates] = useState<{[key: number]: {watered: boolean, planted: boolean, wateredAt?: number, tilled?: boolean, plantedAt?: number, growthStage?: number, needsWater?: boolean}}>({
    0: { watered: false, planted: false },
    1: { watered: false, planted: false },
    2: { watered: false, planted: false },
    3: { watered: false, planted: false },
    4: { watered: false, planted: false },
    5: { watered: false, planted: false },
  });
  
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
  const [currentTime, setCurrentTime] = useState(Date.now());

  const [alamancModalVisible, setAlmanacModalVisible] = useState<boolean>(false);
  
  // Classification modal state
  const [classificationModalVisible, setClassificationModalVisible] = useState(false);
  const [selectedAnomaly, setSelectedAnomaly] = useState<{
    id: number;
    imageUrl: string;
    plot1: number;
    plot2: number;
  } | null>(null);
  const [availableAnomalies, setAvailableAnomalies] = useState<any[]>([]);
  
  // Animation values
  const animationFrame = useRef<number | null>(null);
  
  // Static data for now (future: from Supabase)
  const [clouds] = useState<CloudData[]>([
    { id: 1, x: -100, y: 50, speed: 0.5, size: 60 },
    { id: 2, x: screenWidth + 50, y: 120, speed: 0.3, size: 80 },
    { id: 3, x: screenWidth * 0.5, y: 80, speed: 0.4, size: 70 },
  ]);

  const handleToolSelect = (tool: ToolType) => {
    setSelectedTool(tool);
    setShowFlowers(tool === null);
    console.log('Selected tool:', tool);
  };

  const handlePlotPress = (plotId: number) => {
    if (selectedTool === 'watering-can') {
      const plot = plotStates[plotId];
      const now = Date.now();
      
      // Check if this is a planted plot that needs water for growth
      if (plot?.planted && plot.needsWater && plot.growthStage !== undefined && plot.growthStage < 2) {
        // Water the plant to progress to next growth stage
        const newPlotStates = {
          ...plotStates,
          [plotId]: {
            ...plot,
            needsWater: false,
            growthStage: plot.growthStage + 1,
            wateredAt: now,
          }
        };
        setPlotStates(newPlotStates);
        AsyncStorage.setItem('plotStates', JSON.stringify(newPlotStates));
        console.log(`💧 Watered plant on plot ${plotId}, grew to stage ${plot.growthStage + 1}`);
      } else {
        // Regular plot watering (for tilling)
        const newPlotStates = {
          ...plotStates,
          [plotId]: {
            ...plot,
            watered: true,
            wateredAt: now,
          }
        };
        setPlotStates(newPlotStates);
        AsyncStorage.setItem('plotStates', JSON.stringify(newPlotStates));
      }
    } else if (selectedTool === 'till') {
      const plot = plotStates[plotId];
      if (!plot?.watered) {
        console.log("Plot needs to be watered before it can be tilled");
        return;
      };

      const newPlotStates = {
        ...plotStates,
        [plotId]: {
          ...plot,
          tilled: true,
        }
      };

      setPlotStates(newPlotStates);
      AsyncStorage.setItem('plotStates', JSON.stringify(newPlotStates));
    } else if (selectedTool === 'grass') {
      const plot = plotStates[plotId];
      if (!plot?.tilled) {
        console.log("Plot needs to be tilled before planting grass");
        return;
      }
      if (plot.planted) {
        console.log("Plot already has a plant");
        return;
      }

      const now = Date.now();
      const newPlotStates = {
        ...plotStates,
        [plotId]: {
          ...plot,
          planted: true,
          plantedAt: now,
          growthStage: 0,
          needsWater: false,
          wateredAt: now,
        }
      };

      setPlotStates(newPlotStates);
      AsyncStorage.setItem('plotStates', JSON.stringify(newPlotStates));
      console.log(`🌱 Planted grass on plot ${plotId}`);
    } else if (selectedTool === 'shovel') {
      // Reset plot to default state
      const newPlotStates = {
        ...plotStates,
        [plotId]: {
          watered: false,
          planted: false,
        }
      };

      setPlotStates(newPlotStates);
      AsyncStorage.setItem('plotStates', JSON.stringify(newPlotStates));
      console.log(`🪣 Reset plot ${plotId} to default state`);
    };
  };
  
  const [bees, setBees] = useState<BeeData[]>([
    { id: 1, x: screenWidth * 0.3, y: screenHeight * 0.4, targetX: screenWidth * 0.5, targetY: screenHeight * 0.5, direction: 1 },
    { id: 2, x: screenWidth * 0.7, y: screenHeight * 0.6, targetX: screenWidth * 0.4, targetY: screenHeight * 0.4, direction: -1 },
    { id: 3, x: screenWidth * 0.2, y: screenHeight * 0.3, targetX: screenWidth * 0.6, targetY: screenHeight * 0.5, direction: 1 },
    { id: 4, x: screenWidth * 0.8, y: screenHeight * 0.5, targetX: screenWidth * 0.3, targetY: screenHeight * 0.6, direction: -1 },
    { id: 5, x: screenWidth * 0.5, y: screenHeight * 0.35, targetX: screenWidth * 0.7, targetY: screenHeight * 0.4, direction: 1 },
  ]);

  // Load saved plot states on mount
  useEffect(() => {
    const loadPlotStates = async () => {
      try {
        const savedStates = await AsyncStorage.getItem('plotStates');
        if (savedStates) {
          const parsedStates = JSON.parse(savedStates);
          console.log('📦 Loaded plot states from storage:', parsedStates);
          
          // Migrate old planted plots to include plantedAt and growthStage
          const now = Date.now();
          const migratedStates = { ...parsedStates };
          let needsMigration = false;
          
          Object.keys(migratedStates).forEach(plotId => {
            const plot = migratedStates[parseInt(plotId)];
            if (plot.planted && (plot.plantedAt === undefined || plot.growthStage === undefined || plot.needsWater === undefined)) {
              migratedStates[parseInt(plotId)] = {
                ...plot,
                plantedAt: plot.plantedAt || now,
                growthStage: plot.growthStage !== undefined ? plot.growthStage : 0,
                needsWater: plot.needsWater !== undefined ? plot.needsWater : false,
                wateredAt: plot.wateredAt || now,
              };
              needsMigration = true;
              console.log(`🔄 Migrated plot ${plotId} with plantedAt, growthStage, and needsWater`);
            }
          });
          
          if (needsMigration) {
            await AsyncStorage.setItem('plotStates', JSON.stringify(migratedStates));
            setPlotStates(migratedStates);
          } else {
            setPlotStates(parsedStates);
          }
        } else {
          console.log('📦 No saved plot states found');
        }
      } catch (error) {
        console.error('Error loading plot states:', error);
      }
    };
    loadPlotStates();
  }, []);

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
        const active = DEBUG_FORCE_BEES_ACTIVE || shouldBeesBeActive(currentSunData, temperature, windSpeed);
        console.log('🐝 Bees active status:', active, '(DEBUG_FORCE_BEES_ACTIVE:', DEBUG_FORCE_BEES_ACTIVE, ')');
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
        
        // Force bees active in debug mode
        const fallbackActive = DEBUG_FORCE_BEES_ACTIVE || shouldBeesBeActive(fallbackSunData, 20, 5);
        console.log('🐝 Fallback bees active status:', fallbackActive);
        setBeesActive(fallbackActive);
      }
    };

    getLocationAndData();
    
    // Update data every 5 minutes
    const interval = setInterval(getLocationAndData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Fetch available bee anomalies from Supabase
  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        const { data, error } = await supabase
          .from('anomalies')
          .select('*')
          .eq('anomalytype', 'bumble');

        if (error) {
          console.error('Error fetching anomalies:', error);
          return;
        }

        if (data) {
          console.log('📦 Loaded bee anomalies:', data.length);
          setAvailableAnomalies(data);
        }
      } catch (error) {
        console.error('Error fetching anomalies:', error);
      }
    };

    fetchAnomalies();
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

  // Bee animation - make bees fly around and between plants
  useEffect(() => {
    console.log('🐝 Bee animation effect triggered. beesActive:', beesActive);
    
    if (!beesActive) {
      console.log('🐝 Bees not active - skipping animation');
      return;
    }

    console.log('🐝 Starting bee animation interval');
    let frameCount = 0;

    // Get positions of fully grown plants
    const fullyGrownPositions = plotPositions
      .map((pos, i) => ({ ...pos, plotId: i }))
      .filter(p => plotStates[p.plotId]?.planted && plotStates[p.plotId]?.growthStage === 2)
      .map(p => ({ x: p.x + 60, y: p.y + 45 })); // Center of plot

    const beeAnimationInterval = setInterval(() => {
      frameCount++;
      
      setBees(prevBees => {
        const newBees = prevBees.map(bee => {
          let targetX = bee.targetX ?? bee.x;
          let targetY = bee.targetY ?? bee.y;

          // If bee has reached target or no target set, pick a new target
          const distanceToTarget = Math.sqrt(
            Math.pow(bee.x - targetX, 2) + Math.pow(bee.y - targetY, 2)
          );

          if (distanceToTarget < 20 || !targetX) {
            // Pick a new target
            if (fullyGrownPositions.length > 0) {
              // Fly to a random fully grown plant
              const randomPlant = fullyGrownPositions[Math.floor(Math.random() * fullyGrownPositions.length)];
              targetX = randomPlant.x + (Math.random() - 0.5) * 40; // Add some variance
              targetY = randomPlant.y + (Math.random() - 0.5) * 40;
            } else {
              // No fully grown plants, fly around randomly
              targetX = Math.random() * screenWidth * 0.8 + screenWidth * 0.1;
              targetY = Math.random() * (screenHeight * 0.45) + screenHeight * 0.2;
            }
          }

          // Move toward target
          const dx = targetX - bee.x;
          const dy = targetY - bee.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 5) {
            const speed = 3; // Smooth, consistent speed
            const moveX = (dx / distance) * speed;
            const moveY = (dy / distance) * speed;

            const newX = bee.x + moveX;
            const newY = bee.y + moveY;

            // Update direction based on movement
            const newDirection = moveX > 0 ? 1 : -1;

            return {
              ...bee,
              x: newX,
              y: newY,
              targetX,
              targetY,
              direction: newDirection,
            };
          }

          return { ...bee, targetX, targetY };
        });
        
        return newBees;
      });
    }, 50); // Update every 50ms for smooth movement

    return () => {
      console.log('🐝 Stopping bee animation, total frames:', frameCount);
      clearInterval(beeAnimationInterval);
    };
  }, [beesActive, plotStates]); // Re-run when plotStates change

  const handlePollinationPress = (plot1: number, plot2: number) => {
    console.log(`🐝 Pollination pressed between plots ${plot1} and ${plot2}`);

    // Select a random anomaly
    if (availableAnomalies.length === 0) {
        console.log('No anomalies available for pollination.');
        return;
    }

    const randomAnomaly = availableAnomalies[Math.floor(Math.random() * availableAnomalies.length)];
    const imageUrl = `${supabaseUrl}/storage/v1/object/public/bumble//${randomAnomaly.id}.jpeg`;

    setSelectedAnomaly({
        id: randomAnomaly.id,
        imageUrl: imageUrl,
        plot1,
        plot2,
    });

    setClassificationModalVisible(true);
  };

  const handleClassificationSubmit = async (beeType: string) => {
    if (!selectedAnomaly) return;

    console.log(`🐝 Classification submitted: ${beeType} for anomaly ${selectedAnomaly.id}`);

    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        Alert.alert('Error', 'You must be logged in to submit classifications.');
        return;
      }

      // Save classification to Supabase
      const { data, error } = await supabase
        .from('classifications')
        .insert({
          author: session.user.id,
          anomaly: selectedAnomaly.id,
          media: selectedAnomaly.imageUrl,
          // Always mark this as a 'bumble' classification type
          classificationtype: 'bumble',
          // Store the user's chosen option inside classificationConfiguration
          classificationConfiguration: JSON.stringify({
            plots: [selectedAnomaly.plot1, selectedAnomaly.plot2],
            timestamp: Date.now(),
            // user's chosen option (e.g., 'western-honey-bee', 'something-else', etc.)
            selected: beeType,
          }),
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving classification:', error);
        Alert.alert('Error', 'Failed to save classification. Please try again.');
        return;
      }

      console.log('✅ Classification saved:', data);

      // Save to user stats
      await addHarvestedPlant('grass', selectedAnomaly.plot1, selectedAnomaly.plot2, data.id, beeType);

      // Animate plants shrinking and remove from plots
      await animatePlantHarvest(selectedAnomaly.plot1, selectedAnomaly.plot2);

      Alert.alert('🎉 Success!', `You identified a ${beeType.replace('-', ' ')}! Both plants have been harvested.`);
    } catch (error) {
      console.error('Error in classification submission:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  const animatePlantHarvest = async (plot1: number, plot2: number): Promise<void> => {
    return new Promise((resolve) => {
      // Remove both plants from plots
      const newStates = { ...plotStates };
      
      // Reset both plots to initial state
      newStates[plot1] = {
        watered: false,
        planted: false,
      };
      
      newStates[plot2] = {
        watered: false,
        planted: false,
      };

      setPlotStates(newStates);
      AsyncStorage.setItem('plotStates', JSON.stringify(newStates));

      console.log(`🌾 Harvested plants from plots ${plot1} and ${plot2}`);

      // TODO: Add visual shrinking animation here if desired
      // For now, just resolve after a short delay
      setTimeout(resolve, 500);
    });
  };

  const handlePlanetsPress = () => {
    router.push('/planets');
  };

  const handleIdentifyPress = () => {
    Alert.alert('Identify', 'Plant identification coming soon!');
  };

  // Timer to check for expired watered plots (20 minutes = 1200000ms)
  useEffect(() => {
    const checkWateredPlots = () => {
      const now = Date.now();
      const twentyMinutes = 20 * 60 * 1000; // 20 minutes in milliseconds
      
      setPlotStates(prevStates => {
        const newStates = { ...prevStates };
        let hasChanges = false;
        
        Object.keys(newStates).forEach(plotId => {
          const plot = newStates[parseInt(plotId)];
          if (plot.watered && plot.wateredAt && (now - plot.wateredAt) > twentyMinutes) {
            // Only clear watered state if plot hasn't been tilled or planted yet
            // If tilled or planted, keep those states permanent
            if (!plot.tilled && !plot.planted) {
              newStates[parseInt(plotId)] = {
                ...plot,
                watered: false,
                wateredAt: undefined,
              };
              hasChanges = true;
              console.log(`Plot ${plotId} dried out after 20 minutes`);
            }
          }
        });
        
        if (hasChanges) {
          AsyncStorage.setItem('plotStates', JSON.stringify(newStates));
        }
        
        return hasChanges ? newStates : prevStates;
      });
    };
    
    // Check every 30 seconds
    const interval = setInterval(checkWateredPlots, 30000);
    
    // Also check immediately on mount
    checkWateredPlots();
    
    return () => clearInterval(interval);
  }, []);

  // Update current time every second for countdown display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Check for plant growth progression
  useEffect(() => {
    const checkPlantGrowth = () => {
      const now = Date.now();
      const growthInterval = 20 * 60 * 1000; // 20 minutes per growth stage
      
      setPlotStates(prevStates => {
        const newStates = { ...prevStates };
        let hasChanges = false;
        
        Object.keys(newStates).forEach(plotId => {
          const plot = newStates[parseInt(plotId)];
          if (plot.planted && plot.plantedAt && plot.growthStage !== undefined) {
            const timeSinceLastWatered = plot.wateredAt ? now - plot.wateredAt : now - plot.plantedAt;
            
            // Check if it's been 20 minutes since last watering and plant hasn't reached max growth
            if (timeSinceLastWatered >= growthInterval && !plot.needsWater && plot.growthStage < 2) {
              // Plant needs water to progress to next stage
              newStates[parseInt(plotId)] = {
                ...plot,
                needsWater: true,
              };
              hasChanges = true;
              console.log(`💧 Plot ${plotId} needs water to grow from stage ${plot.growthStage} to ${plot.growthStage + 1}`);
            }
          }
        });
        
        if (hasChanges) {
          AsyncStorage.setItem('plotStates', JSON.stringify(newStates));
        }
        
        return hasChanges ? newStates : prevStates;
      });
    };
    
    // Check every 10 seconds
    const interval = setInterval(checkPlantGrowth, 10000);
    
    // Also check immediately on mount
    checkPlantGrowth();
    
    return () => clearInterval(interval);
  }, []);

  const handlePlanetPress = () => {
    router.push('/settings');
  };

  // Debug function to fast-forward all plant growth
  const handleFastForwardGrowth = async () => {
    const newStates = { ...plotStates };
    let hasChanges = false;

    Object.keys(newStates).forEach(plotId => {
      const plot = newStates[parseInt(plotId)];
      if (plot.planted && plot.growthStage !== undefined && plot.growthStage < 2) {
        // Set plant to need water for next growth
        newStates[parseInt(plotId)] = {
          ...plot,
          needsWater: true,
          wateredAt: Date.now() - (20 * 60 * 1000), // Set as if 20 minutes have passed
        };
        hasChanges = true;
        console.log(`⏩ Fast-forwarded plot ${plotId} - now needs water to grow`);
      }
    });

    if (hasChanges) {
      setPlotStates(newStates);
      await AsyncStorage.setItem('plotStates', JSON.stringify(newStates));
      Alert.alert('🌱 Growth Ready', 'All plants are ready to be watered for next growth stage!');
    } else {
      Alert.alert('🌱 No Plants to Fast-Forward', 'All plants are either fully grown or no plants exist.');
    }
  };

  // Helper function to format time remaining until next growth stage
  const getTimeUntilNextGrowth = (plot: typeof plotStates[0]): string => {
    if (!plot.planted || !plot.plantedAt || plot.growthStage === undefined) {
      return '';
    }
    
    // If plant needs water, don't show timer
    if (plot.needsWater) {
      return '';
    }
    
    // If fully grown (stage 2), no more growth
    if (plot.growthStage >= 2) {
      return 'Fully Grown';
    }
    
    const growthInterval = 20 * 60 * 1000; // 20 minutes
    const timeSinceLastWatered = plot.wateredAt ? currentTime - plot.wateredAt : currentTime - plot.plantedAt;
    const timeToNextStage = growthInterval - timeSinceLastWatered;
    
    if (timeToNextStage <= 0) {
      return '';
    }
    
    const minutes = Math.floor(timeToNextStage / 60000);
    const seconds = Math.floor((timeToNextStage % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
        
        {/* Bees - render before plots so they don't block touches */}
        <Bees 
          bees={bees} 
          beesActive={beesActive} 
          sunData={sunData} 
          weatherData={weatherData}
          fullyGrownPlantCount={Object.values(plotStates).filter(p => p.planted && p.growthStage === 2).length}
          fullyGrownPlantPositions={plotPositions
            .map((pos, i) => ({ ...pos, plotId: i }))
            .filter(p => plotStates[p.plotId]?.planted && plotStates[p.plotId]?.growthStage === 2)
            .map(p => ({ x: p.x + 60, y: p.y + 45, plotId: p.plotId }))}
          onPollinationPress={handlePollinationPress}
        />

        {/* Garden plots and flowers */}
        <GardenPlots 
          showFlowers={showFlowers} 
          selectedTool={selectedTool}
          plotStates={plotStates}
          onPlotPress={handlePlotPress}
        />

        <PlantingToolbar onToolSelect={handleToolSelect} showTill={Object.values(plotStates).some(s => s.watered)} toolbarTop={screenHeight * 0.06} />

        {/* Direct plot touch areas - render at very end to be on top */}
        {plotPositions.map((position, i) => (
          <TouchableOpacity
            key={`plot-${i}`}
            style={{
              position: 'absolute',
              left: position.x,
              top: position.y,
              width: position.width,
              height: position.height,
              backgroundColor: selectedTool === 'watering-can' && !plotStates[i]?.watered
                ? 'rgba(0, 255, 0, 0.6)'
                : selectedTool === 'grass' && plotStates[i]?.tilled && !plotStates[i]?.planted
                  ? 'rgba(0, 200, 0, 0.4)' // Green tint for plantable plots
                : selectedTool === 'shovel'
                  ? 'rgba(255, 0, 0, 0.4)' // Red tint for reset
                : plotStates[i]?.watered
                  ? 'rgba(139, 69, 19, 0.5)' // Darker brown for watered plots
                  : 'transparent',
              borderRadius: 20,
              zIndex: 10000,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              console.log(`🚰 PLOT ${i} TOUCHED!`);
              handlePlotPress(i);
            }}
          >
            {selectedTool === 'watering-can' && !plotStates[i]?.watered && (
              <Text style={{ fontSize: 24, color: 'green' }}>💧</Text>
            )}
            {selectedTool === 'grass' && plotStates[i]?.tilled && !plotStates[i]?.planted && (
              <Text style={{ fontSize: 24, color: 'green' }}>🌱</Text>
            )}
            {selectedTool === 'shovel' && (
              <Text style={{ fontSize: 24, color: 'red' }}>🪣</Text>
            )}
          </TouchableOpacity>
        ))}

        {/* Growth timers below planted plots */}
        {plotPositions.map((position, i) => {
          const plot = plotStates[i];
          
          console.log(`Plot ${i} check:`, {
            planted: plot?.planted,
            plantedAt: plot?.plantedAt,
            growthStage: plot?.growthStage,
          });
          
          if (!plot?.planted) return null;
          
          const timeText = getTimeUntilNextGrowth(plot);
          console.log(`Plot ${i} timeText:`, timeText);
          
          if (!timeText) return null;
          
          return (
            <View
              key={`timer-${i}`}
              style={{
                position: 'absolute',
                left: position.x,
                top: position.y + position.height + 5,
                width: position.width,
                alignItems: 'center',
                zIndex: 10001,
              }}
            >
              <View style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
              }}>
                <Text style={{
                  color: plot.growthStage === 2 ? '#4CAF50' : '#FFD700',
                  fontSize: 12,
                  fontWeight: 'bold',
                }}>
                  {timeText}
                </Text>
              </View>
            </View>
          );
        })}

        {/* Water bubble indicators for plants that need water */}
        {plotPositions.map((position, i) => {
          const plot = plotStates[i];
          
          if (!plot?.planted || !plot.needsWater) return null;
          
          return (
            <View
              key={`water-bubble-${i}`}
              style={{
                position: 'absolute',
                left: position.x + position.width - 10,
                top: position.y - 30,
                zIndex: 10002,
              }}
            >
              {/* Speech bubble tail (triangle) */}
              <View style={{
                position: 'absolute',
                bottom: -8,
                left: 12,
                width: 0,
                height: 0,
                borderLeftWidth: 8,
                borderRightWidth: 8,
                borderTopWidth: 10,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderTopColor: 'white',
              }} />
              
              {/* Speech bubble */}
              <View style={{
                backgroundColor: 'white',
                borderRadius: 20,
                padding: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
                minWidth: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{ fontSize: 20 }}>💧</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* HUD Overlay */}
      <WeatherHUD 
        weather={weather}
        weatherData={weatherData}
        userEmail={userEmail}
        currentPlanet={currentPlanet}
        calculateGrowthRate={calculateGrowthRate}
      />

      {/* Debug: Fast-forward button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 50,
          right: 20,
          backgroundColor: 'rgba(255, 152, 0, 0.9)',
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          zIndex: 10002,
        }}
        onPress={handleFastForwardGrowth}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>⏩ Fast Forward</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={handlePlanetsPress}>
          <View style={styles.navIconContainer}>
            <PlanetIcon size={28} color="#4A90E2" />
          </View>
          <Text style={styles.navText}>Planets</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => setAlmanacModalVisible(true)}>
          <Text style={styles.navIcon}>📖</Text>
          <Text style={styles.navText}>Almanac</Text>
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

      {/* Classification Modal */}
      <ClassificationModal
        visible={classificationModalVisible}
        onClose={() => {
          setClassificationModalVisible(false);
          setSelectedAnomaly(null);
        }}
        onClassify={handleClassificationSubmit}
        anomalyId={selectedAnomaly?.id || 0}
        anomalyImageUrl={selectedAnomaly?.imageUrl}
      />

      <AlmanacModal
        visible={alamancModalVisible}
        onClose={() => setAlmanacModalVisible(false)}
      />
    </View>
  );
}