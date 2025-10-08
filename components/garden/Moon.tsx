import { MoonAstronomyData, SunData, getTimeOfDay } from '@/lib/astronomy';
import React from 'react';
import { Dimensions, View } from 'react-native';
import { moonStyles as styles } from '../../styles/garden/MoonStyles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface MoonProps {
  moonData: MoonAstronomyData | null;
  sunData: SunData | null;
}

export default function Moon({ moonData, sunData }: MoonProps) {
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
}