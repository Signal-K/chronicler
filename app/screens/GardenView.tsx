import PlanetIcon from '@/components/PlanetIcon';
import { generateStarField, getMoonAstronomyData, getStarVisibility, getSunData, getTimeOfDay, MoonAstronomyData, shouldBeesBeActive, StarVisibility, SunData } from '@/lib/astronomy';
import { supabase } from '@/lib/supabase';
import { getCurrentWeather, getSkyColors, WeatherData } from '@/lib/weather';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
  const [userEmail, setUserEmail] = useState<string>('');
  const [weather, setWeather] = useState<string>('Loading...');
  const [cloudOffset, setCloudOffset] = useState<number>(0);
  
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

  // Render the moon with accurate phase and positioning
  const renderMoon = () => {
    if (!moonData || !sunData) return null;

    const timeOfDay = getTimeOfDay(sunData);
    
    // Only show moon during twilight and night
    if (timeOfDay === 'day') return null;

    // Calculate moon position (simplified for screen placement)
    const moonX = screenWidth * 0.8; // Upper right area
    const moonY = screenHeight * 0.15;
    
    // Moon size based on distance (closer = larger)
    const baseMoonSize = 40;
    const moonSize = baseMoonSize * (384400 / moonData.distance);
    
    // Moon phase visualization
    const illuminationPercent = moonData.illumination;
    
    return (
      <View style={styles.moonContainer}>
        {/* Full moon circle (dark side) */}
        <View 
          style={[
            styles.moonDark,
            {
              left: moonX - moonSize / 2,
              top: moonY - moonSize / 2,
              width: moonSize,
              height: moonSize,
              borderRadius: moonSize / 2,
            }
          ]}
        />
        
        {/* Illuminated portion */}
        <View 
          style={[
            styles.moonLight,
            {
              left: moonX - moonSize / 2,
              top: moonY - moonSize / 2,
              width: moonSize * illuminationPercent,
              height: moonSize,
              borderRadius: moonSize / 2,
              transform: [
                { scaleX: moonData.phase < 0.5 ? 1 : -1 }, // Waxing vs waning
              ],
            }
          ]}
        />

        {/* Moon glow effect */}
        {illuminationPercent > 0.3 && (
          <View 
            style={[
              styles.moonGlow,
              {
                left: moonX - moonSize * 0.75,
                top: moonY - moonSize * 0.75,
                width: moonSize * 1.5,
                height: moonSize * 1.5,
                borderRadius: moonSize * 0.75,
                opacity: illuminationPercent * 0.3,
              }
            ]}
          />
        )}
      </View>
    );
  };

  // Render stars in the night sky
  const renderStars = () => {
    if (!starVisibility?.isVisible || starField.length === 0) return null;

    return starField.map((star, index) => (
      star.visible ? (
        <View
          key={`star-${index}`}
          style={[
            styles.star,
            {
              left: star.x * screenWidth,
              top: star.y * screenHeight * 0.6, // Only in upper 60% of screen
              width: star.size,
              height: star.size,
              opacity: star.magnitude,
              borderRadius: star.size / 2,
            }
          ]}
        />
      ) : null
    ));
  };

  // Render clouds with CSS-style positioning
  const renderClouds = () => {
    return clouds.map((cloud) => (
      <View key={cloud.id} style={styles.cloudContainer}>
        {/* Cloud circles to create cloud shape */}
        <View 
          style={[
            styles.cloudCircle,
            {
              left: (cloud.x + cloudOffset * cloud.speed) % (screenWidth + 200) - 100,
              top: cloud.y,
              width: cloud.size * 1.2,
              height: cloud.size * 1.2,
              borderRadius: cloud.size * 0.6,
            }
          ]}
        />
        <View 
          style={[
            styles.cloudCircle,
            {
              left: (cloud.x + cloudOffset * cloud.speed) % (screenWidth + 200) - 50,
              top: cloud.y,
              width: cloud.size * 1.6,
              height: cloud.size * 1.6,
              borderRadius: cloud.size * 0.8,
            }
          ]}
        />
        <View 
          style={[
            styles.cloudCircle,
            {
              left: (cloud.x + cloudOffset * cloud.speed) % (screenWidth + 200),
              top: cloud.y,
              width: cloud.size * 2,
              height: cloud.size * 2,
              borderRadius: cloud.size,
            }
          ]}
        />
      </View>
    ));
  };

  // Render bees with detailed anatomy and time-based behavior
  const renderBees = () => {
    if (!beesActive && sunData && getTimeOfDay(sunData) === 'night') {
      // Bees are sleeping - show fewer bees or make them stationary
      return bees.slice(0, 2).map((bee) => {
        return (
          <View key={bee.id} style={styles.beeContainer}>
            {/* Sleeping bee - simpler rendering with lower opacity */}
            <View 
              style={[
                styles.sleepingBee,
                {
                  left: bee.x - 8,
                  top: bee.y + 20, // Lower position (resting)
                  opacity: 0.6,
                }
              ]}
            />
            {/* ZZZ sleep indicator */}
            <Text style={[
              styles.sleepIndicator,
              {
                left: bee.x + 10,
                top: bee.y + 5,
              }
            ]}>💤</Text>
          </View>
        );
      });
    }
    
    // Active bees during day/twilight
    const activeBeeCount = beesActive ? bees.length : Math.max(2, Math.floor(bees.length * 0.6));
    
    return bees.slice(0, activeBeeCount).map((bee) => {
      const facingLeft = bee.direction === -1;
      const activityOpacity = beesActive ? 1 : 0.8; // Slightly less active during twilight
      
      return (
        <View key={bee.id} style={styles.beeContainer}>
          {/* Bee head */}
          <View 
            style={[
              styles.beeHead,
              {
                left: bee.x + (facingLeft ? 8 : -12),
                top: bee.y - 6,
                opacity: activityOpacity,
              }
            ]}
          />
          
          {/* Large compound eyes */}
          <View 
            style={[
              styles.beeEye,
              {
                left: bee.x + (facingLeft ? 10 : -8),
                top: bee.y - 4,
                opacity: activityOpacity,
              }
            ]}
          />
          <View 
            style={[
              styles.beeEye,
              {
                left: bee.x + (facingLeft ? 14 : -4),
                top: bee.y - 6,
                opacity: activityOpacity,
              }
            ]}
          />
          
          {/* Antennae */}
          <View 
            style={[
              styles.antenna,
              {
                left: bee.x + (facingLeft ? 12 : -6),
                top: bee.y - 8,
                transform: [{ rotate: facingLeft ? '-20deg' : '20deg' }],
                opacity: activityOpacity,
              }
            ]}
          />
          <View 
            style={[
              styles.antenna,
              {
                left: bee.x + (facingLeft ? 16 : -2),
                top: bee.y - 8,
                transform: [{ rotate: facingLeft ? '20deg' : '-20deg' }],
                opacity: activityOpacity,
              }
            ]}
          />

          {/* Thorax (middle body section) */}
          <View 
            style={[
              styles.beeThorax,
              {
                left: bee.x - 4,
                top: bee.y - 4,
                opacity: activityOpacity,
              }
            ]}
          />
          
          {/* Abdomen (main body with stripes) */}
          <View 
            style={[
              styles.beeAbdomen,
              {
                left: bee.x - 8,
                top: bee.y - 6,
                opacity: activityOpacity,
              }
            ]}
          />
          
          {/* Black stripes on abdomen */}
          <View 
            style={[
              styles.beeStripe,
              {
                left: bee.x - 8,
                top: bee.y - 3,
                opacity: activityOpacity,
              }
            ]}
          />
          <View 
            style={[
              styles.beeStripe,
              {
                left: bee.x - 8,
                top: bee.y + 1,
                opacity: activityOpacity,
              }
            ]}
          />
          <View 
            style={[
              styles.beeStripe,
              {
                left: bee.x - 8,
                top: bee.y + 5,
                opacity: activityOpacity,
              }
            ]}
          />

          {/* Wings - 4 wings total (less animated if not fully active) */}
          <View 
            style={[
              styles.beeWingLarge,
              {
                left: bee.x + (facingLeft ? -18 : 8),
                top: bee.y - 12,
                transform: [
                  { rotate: facingLeft ? '15deg' : '-15deg' },
                  { scaleX: facingLeft ? -1 : 1 }
                ],
                opacity: activityOpacity,
              }
            ]}
          />
          <View 
            style={[
              styles.beeWingLarge,
              {
                left: bee.x + (facingLeft ? -15 : 5),
                top: bee.y - 10,
                transform: [
                  { rotate: facingLeft ? '-15deg' : '15deg' },
                  { scaleX: facingLeft ? -1 : 1 }
                ],
                opacity: activityOpacity,
              }
            ]}
          />
          <View 
            style={[
              styles.beeWingSmall,
              {
                left: bee.x + (facingLeft ? -12 : 6),
                top: bee.y - 8,
                transform: [
                  { rotate: facingLeft ? '25deg' : '-25deg' },
                  { scaleX: facingLeft ? -1 : 1 }
                ],
                opacity: activityOpacity,
              }
            ]}
          />
          <View 
            style={[
              styles.beeWingSmall,
              {
                left: bee.x + (facingLeft ? -10 : 4),
                top: bee.y - 6,
                transform: [
                  { rotate: facingLeft ? '-25deg' : '25deg' },
                  { scaleX: facingLeft ? -1 : 1 }
                ],
                opacity: activityOpacity,
              }
            ]}
          />

          {/* Legs - 6 legs total */}
          <View 
            style={[
              styles.beeLeg,
              {
                left: bee.x + (facingLeft ? 4 : -6),
                top: bee.y + 6,
                transform: [{ rotate: facingLeft ? '135deg' : '45deg' }],
                opacity: activityOpacity,
              }
            ]}
          />
          <View 
            style={[
              styles.beeLeg,
              {
                left: bee.x + (facingLeft ? 2 : -4),
                top: bee.y + 8,
                transform: [{ rotate: facingLeft ? '120deg' : '60deg' }],
                opacity: activityOpacity,
              }
            ]}
          />
          <View 
            style={[
              styles.beeLeg,
              {
                left: bee.x + (facingLeft ? 0 : -2),
                top: bee.y + 10,
                transform: [{ rotate: facingLeft ? '105deg' : '75deg' }],
                opacity: activityOpacity,
              }
            ]}
          />
          <View 
            style={[
              styles.beeLeg,
              {
                left: bee.x + (facingLeft ? -4 : 2),
                top: bee.y + 6,
                transform: [{ rotate: facingLeft ? '45deg' : '135deg' }],
                opacity: activityOpacity,
              }
            ]}
          />
          <View 
            style={[
              styles.beeLeg,
              {
                left: bee.x + (facingLeft ? -2 : 0),
                top: bee.y + 8,
                transform: [{ rotate: facingLeft ? '60deg' : '120deg' }],
                opacity: activityOpacity,
              }
            ]}
          />
          <View 
            style={[
              styles.beeLeg,
              {
                left: bee.x + (facingLeft ? 0 : -2),
                top: bee.y + 10,
                transform: [{ rotate: facingLeft ? '75deg' : '105deg' }],
                opacity: activityOpacity,
              }
            ]}
          />
        </View>
      );
    });
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
        {renderStars()}
        
        {/* Moon layer */}
        {renderMoon()}
        
        {/* Clouds layer */}
        {renderClouds()}

        {/* Grass terrain strip (foreground) - covers bottom 45% */}
        <View style={styles.grassTerrain}>
          {/* Grass texture elements */}
          <View style={styles.grassTexture1} />
          <View style={styles.grassTexture2} />
          <View style={styles.grassTexture3} />
          <View style={styles.grassTexture4} />
          <View style={styles.grassTexture5} />
        </View>
        
        {/* Plots in uniform squircle shapes */}
        <View style={[styles.plotContainer, { left: 40, top: screenHeight * 0.58 }]} />
        <View style={[styles.plotContainer, { left: screenWidth * 0.3, top: screenHeight * 0.62 }]} />
        <View style={[styles.plotContainer, { left: screenWidth * 0.6, top: screenHeight * 0.59 }]} />
        <View style={[styles.plotContainer, { left: 60, top: screenHeight * 0.72 }]} />
        <View style={[styles.plotContainer, { left: screenWidth * 0.4, top: screenHeight * 0.75 }]} />
        <View style={[styles.plotContainer, { left: screenWidth * 0.75, top: screenHeight * 0.7 }]} />

        {/* Flowers on the plots */}
        <View style={styles.flowerContainer}>
          {/* Plot 1 flowers */}
          <View style={[styles.flower, styles.pinkFlower, { left: 60, top: screenHeight * 0.6 }]} />
          <View style={[styles.flowerCenter, { left: 65, top: screenHeight * 0.605 }]} />
          <View style={[styles.flower, styles.pinkFlower, { left: 75, top: screenHeight * 0.61 }]} />
          
          {/* Plot 2 flowers */}
          <View style={[styles.flower, styles.orangeFlower, { left: screenWidth * 0.32, top: screenHeight * 0.64 }]} />
          <View style={[styles.flowerCenter, { left: screenWidth * 0.325, top: screenHeight * 0.645 }]} />
          <View style={[styles.flower, styles.orangeFlower, { left: screenWidth * 0.34, top: screenHeight * 0.65 }]} />
          
          {/* Plot 3 flowers */}
          <View style={[styles.flower, styles.purpleFlower, { left: screenWidth * 0.62, top: screenHeight * 0.61 }]} />
          <View style={[styles.flowerCenter, { left: screenWidth * 0.625, top: screenHeight * 0.615 }]} />
          <View style={[styles.flower, styles.purpleFlower, { left: screenWidth * 0.64, top: screenHeight * 0.62 }]} />
          
          {/* Plot 4 flowers */}
          <View style={[styles.flower, styles.yellowFlower, { left: 80, top: screenHeight * 0.74 }]} />
          <View style={[styles.flowerCenter, { left: 85, top: screenHeight * 0.745 }]} />
          <View style={[styles.flower, styles.yellowFlower, { left: 95, top: screenHeight * 0.75 }]} />
          
          {/* Plot 5 flowers */}
          <View style={[styles.flower, styles.redFlower, { left: screenWidth * 0.42, top: screenHeight * 0.77 }]} />
          <View style={[styles.flowerCenter, { left: screenWidth * 0.425, top: screenHeight * 0.775 }]} />
          <View style={[styles.flower, styles.redFlower, { left: screenWidth * 0.44, top: screenHeight * 0.78 }]} />
          
          {/* Plot 6 flowers */}
          <View style={[styles.flower, styles.blueFlower, { left: screenWidth * 0.77, top: screenHeight * 0.72 }]} />
          <View style={[styles.flowerCenter, { left: screenWidth * 0.775, top: screenHeight * 0.725 }]} />
          <View style={[styles.flower, styles.blueFlower, { left: screenWidth * 0.79, top: screenHeight * 0.73 }]} />
        </View>

        {/* Bees */}
        {renderBees()}
      </View>

      {/* HUD Overlay */}
      <View style={styles.hud}>
        <View style={styles.hudContent}>
          <Text style={styles.hudText}>🌤️ {weather}</Text>
          <Text style={styles.hudText}>👤 {userEmail}</Text>
        </View>
      </View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // Light sky blue
  },
  backgroundContainer: {
    flex: 1,
    position: 'relative',
  },
  sky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#87CEEB',
  },
  skyGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    opacity: 0.6,
  },
  star: {
    position: 'absolute',
    backgroundColor: 'white',
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 2,
  },
  moonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  moonDark: {
    position: 'absolute',
    backgroundColor: '#2C3E50', // Dark gray for moon's dark side
  },
  moonLight: {
    position: 'absolute',
    backgroundColor: '#F8F9FA', // Light gray/white for illuminated side
    overflow: 'hidden',
  },
  moonGlow: {
    position: 'absolute',
    backgroundColor: 'rgba(248, 249, 250, 0.2)',
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  sleepingBee: {
    position: 'absolute',
    width: 16,
    height: 10,
    borderRadius: 8,
    backgroundColor: '#B8860B', // Darker bee when sleeping
  },
  sleepIndicator: {
    position: 'absolute',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cloudContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cloudCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  grassTerrain: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%', // Covers bottom 45% of display
    backgroundColor: '#228B22',
  },
  // Grass texture elements for more natural look
  grassTexture1: {
    position: 'absolute',
    bottom: '70%',
    left: '10%',
    width: '80%',
    height: 8,
    backgroundColor: '#32CD32',
    opacity: 0.6,
    borderRadius: 4,
  },
  grassTexture2: {
    position: 'absolute',
    bottom: '50%',
    left: '5%',
    width: '90%',
    height: 6,
    backgroundColor: '#90EE90',
    opacity: 0.4,
    borderRadius: 3,
  },
  grassTexture3: {
    position: 'absolute',
    bottom: '30%',
    left: '15%',
    width: '70%',
    height: 10,
    backgroundColor: '#006400',
    opacity: 0.3,
    borderRadius: 5,
  },
  grassTexture4: {
    position: 'absolute',
    bottom: '80%',
    left: '20%',
    width: '60%',
    height: 4,
    backgroundColor: '#ADFF2F',
    opacity: 0.5,
    borderRadius: 2,
  },
  grassTexture5: {
    position: 'absolute',
    bottom: '60%',
    left: '8%',
    width: '85%',
    height: 7,
    backgroundColor: '#7CFC00',
    opacity: 0.3,
    borderRadius: 3,
  },
  // Uniform squircle-shaped plots
  plotContainer: {
    position: 'absolute',
    width: 80,
    height: 60,
    backgroundColor: '#8B4513',
    borderRadius: 20, // Squircle shape (rounded rectangle)
  },
  flowerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  flower: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  pinkFlower: {
    backgroundColor: '#FF69B4',
  },
  orangeFlower: {
    backgroundColor: '#FF4500',
  },
  purpleFlower: {
    backgroundColor: '#9370DB',
  },
  yellowFlower: {
    backgroundColor: '#FFD700',
  },
  redFlower: {
    backgroundColor: '#DC143C',
  },
  blueFlower: {
    backgroundColor: '#4169E1',
  },
  flowerCenter: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD700',
  },
  beeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Bee head - brown/dark yellow
  beeHead: {
    position: 'absolute',
    width: 12,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#B8860B', // Dark golden rod
  },
  // Large compound eyes - dark red/brown
  beeEye: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#8B0000', // Dark red
  },
  // Antennae - thin dark lines
  antenna: {
    position: 'absolute',
    width: 1,
    height: 6,
    backgroundColor: '#654321', // Dark brown
  },
  // Thorax - fuzzy middle section
  beeThorax: {
    position: 'absolute',
    width: 12,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DAA520', // Golden rod - fuzzy appearance
  },
  // Abdomen - main body with yellow base
  beeAbdomen: {
    position: 'absolute',
    width: 18,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD700', // Gold
  },
  // Black stripes on abdomen
  beeStripe: {
    position: 'absolute',
    width: 18,
    height: 2,
    backgroundColor: '#000000',
  },
  // Large forewings - translucent with veining
  beeWingLarge: {
    position: 'absolute',
    width: 16,
    height: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 0.5,
    borderColor: 'rgba(139, 69, 19, 0.3)', // Subtle brown veining
  },
  // Smaller hindwings
  beeWingSmall: {
    position: 'absolute',
    width: 10,
    height: 8,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 0.5,
    borderColor: 'rgba(139, 69, 19, 0.2)',
  },
  // Six legs - thin and jointed
  beeLeg: {
    position: 'absolute',
    width: 1,
    height: 8,
    backgroundColor: '#654321', // Dark brown
  },
  beeBody: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFD700',
  },
  beeWing: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  hud: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  hudContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hudText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  navButton: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 10,
  },
  navIconContainer: {
    marginBottom: 5,
  },
  navIcon: {
    fontSize: 28,
    marginBottom: 5,
  },
  navText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});