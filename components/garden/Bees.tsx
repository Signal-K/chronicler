import { SunData, getTimeOfDay } from '@/lib/astronomy';
import { WeatherData } from '@/lib/weather';
import React from 'react';
import { Text, View } from 'react-native';
import { beesStyles as styles } from '../../styles/garden/BeesStyles';

interface BeeData {
  id: number;
  x: number;
  y: number;
  direction: number;
}

interface BeesProps {
  bees: BeeData[];
  beesActive: boolean;
  sunData: SunData | null;
  weatherData: WeatherData | null;
}

export default function Bees({ bees, beesActive, sunData, weatherData }: BeesProps) {
    if (!beesActive && sunData && getTimeOfDay(sunData) === 'night') {
    // Bees are sleeping - show fewer bees or make them stationary
    return (
      <>
        {bees.slice(0, 2).map((bee) => (
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
        ))}
      </>
    );
  }
  
  // Active bees during day/twilight
  const activeBeeCount = beesActive ? bees.length : Math.max(2, Math.floor(bees.length * 0.6));
  
  return (
    <>
      {bees.slice(0, activeBeeCount).map((bee) => {
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
      })}
    </>
  );
}