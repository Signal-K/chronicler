import { SunData, getTimeOfDay } from '@/lib/astronomy';
import { WeatherData } from '@/lib/weather';
import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { beesStyles as styles } from '../../styles/garden/BeesStyles';

interface BeeData {
  id: number;
  x: number;
  y: number;
  direction: number;
}

interface PollenDrop {
  id: number;
  x: number;
  y: number;
  createdAt: number;
}

interface BeesProps {
  bees: BeeData[];
  beesActive: boolean;
  sunData: SunData | null;
  weatherData: WeatherData | null;
  fullyGrownPlantCount: number;
  fullyGrownPlantPositions: { x: number; y: number }[];
}

export default function Bees({ bees, beesActive, sunData, weatherData, fullyGrownPlantCount, fullyGrownPlantPositions }: BeesProps) {
  const [pollenDrops, setPollenDrops] = useState<PollenDrop[]>([]);
  const [showBreedingMessage, setShowBreedingMessage] = useState(false);
  const isPollinationActive = fullyGrownPlantCount >= 2;

  // Generate pollen drops when pollination is active
  useEffect(() => {
    if (!isPollinationActive || !beesActive) {
      setPollenDrops([]);
      setShowBreedingMessage(false);
      return;
    }

    setShowBreedingMessage(true);

    // Add new pollen drops sporadically
    const pollenInterval = setInterval(() => {
      if (fullyGrownPlantPositions.length >= 2) {
        const randomPlantIndex = Math.floor(Math.random() * fullyGrownPlantPositions.length);
        const plantPos = fullyGrownPlantPositions[randomPlantIndex];
        
        // Create pollen drop near the plant
        const newPollen: PollenDrop = {
          id: Date.now() + Math.random(),
          x: plantPos.x + Math.random() * 80 - 40, // Spread around plant
          y: plantPos.y + Math.random() * 60 - 30,
          createdAt: Date.now(),
        };
        
        setPollenDrops(prev => [...prev, newPollen]);
      }
    }, 3000); // Drop pollen every 3 seconds

    // Clean up old pollen drops
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setPollenDrops(prev => prev.filter(p => now - p.createdAt < 5000)); // Remove after 5 seconds
    }, 1000);

    return () => {
      clearInterval(pollenInterval);
      clearInterval(cleanupInterval);
    };
  }, [isPollinationActive, beesActive, fullyGrownPlantPositions]);

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

      {/* Pollen drops */}
      {pollenDrops.map((pollen) => (
        <Image
          key={pollen.id}
          source={require('@/assets/Sprites/Growing Plants/tile062.png')}
          style={{
            position: 'absolute',
            left: pollen.x,
            top: pollen.y,
            width: 24,
            height: 24,
            zIndex: 100,
          }}
          resizeMode="contain"
        />
      ))}

      {/* Breeding notification speech bubble */}
      {showBreedingMessage && (
        <View
          style={{
            position: 'absolute',
            left: bees[0]?.x + 20 || 100,
            top: bees[0]?.y - 60 || 100,
            zIndex: 101,
          }}
        >
          {/* Speech bubble tail */}
          <View style={{
            position: 'absolute',
            bottom: -8,
            left: 20,
            width: 0,
            height: 0,
            borderLeftWidth: 8,
            borderRightWidth: 8,
            borderTopWidth: 10,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderTopColor: '#FFF3CD',
          }} />
          
          {/* Speech bubble */}
          <View style={{
            backgroundColor: '#FFF3CD',
            borderRadius: 15,
            padding: 12,
            borderWidth: 2,
            borderColor: '#FFD700',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
            minWidth: 150,
          }}>
            <Text style={{ 
              fontSize: 12, 
              fontWeight: 'bold', 
              color: '#856404',
              textAlign: 'center',
            }}>
              🐝 Ready to breed!
            </Text>
            <Text style={{ 
              fontSize: 10, 
              color: '#856404',
              textAlign: 'center',
              marginTop: 4,
            }}>
              Identify to create new plant
            </Text>
          </View>
        </View>
      )}
    </>
  );
}