import { SunData, getTimeOfDay } from '@/lib/astronomy';
import { WeatherData } from '@/lib/weather';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
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
  fullyGrownPlantPositions: { x: number; y: number; plotId: number }[];
  onPollinationPress: (plot1: number, plot2: number) => void;
};

interface PollinationIndicator {
  id: string;
  x: number;
  y: number;
  plot1: number;
  plot2: number;
};

export default function Bees({ 
  bees, 
  beesActive, 
  sunData, 
  weatherData, 
  fullyGrownPlantCount, 
  fullyGrownPlantPositions,
  onPollinationPress 
}: BeesProps) {
  const [pollinationIndicators, setPollinationIndicators] = useState<PollinationIndicator[]>([]);
  const isPollinationActive = fullyGrownPlantCount >= 2;

  useEffect(() => {
    if (!isPollinationActive || !beesActive || fullyGrownPlantPositions.length < 2) {
      setPollinationIndicators([]);
      return;
    };

    const indicators: PollinationIndicator[] = [];

    for (let i = 0; i < fullyGrownPlantPositions.length - 1; i++) {
      const plant1 = fullyGrownPlantPositions[i];
      const plant2 = fullyGrownPlantPositions[i + 1];

      const midX = (plant1.x + plant2.x) / 2;
      const midY = (plant1.y + plant2.y) / 2;

      indicators.push({
        id: `pollination-${plant1.plotId}-${plant2.plotId}`,
        x: midX,
        y: midY,
        plot1: plant1.plotId,
        plot2: plant2.plotId,
      });
    };

    setPollinationIndicators(indicators);
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

            {/* Pollination indicators */}
      {pollinationIndicators.map((indicator) => (
        <TouchableOpacity
          key={indicator.id}
          style={{
            position: 'absolute',
            left: indicator.x - 40,
            top: indicator.y - 80,
            zIndex: 10003,
          }}
          onPress={() => onPollinationPress(indicator.plot1, indicator.plot2)}
          activeOpacity={0.7}
        >
          {/* Speech bubble tail */}
          <View style={{
            position: 'absolute',
            bottom: -8,
            left: 32,
            width: 0,
            height: 0,
            borderLeftWidth: 10,
            borderRightWidth: 10,
            borderTopWidth: 12,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderTopColor: '#FFF3CD',
          }} />
          
          {/* Speech bubble */}
          <View style={{
            backgroundColor: '#FFF3CD',
            borderRadius: 20,
            padding: 16,
            borderWidth: 3,
            borderColor: '#FFD700',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 6,
            elevation: 8,
            minWidth: 80,
            alignItems: 'center',
          }}>
            <Text style={{ 
              fontSize: 32,
            }}>
              🐝
            </Text>
            <Text style={{ 
              fontSize: 11, 
              fontWeight: 'bold', 
              color: '#856404',
              textAlign: 'center',
              marginTop: 6,
            }}>
              Tap to identify!
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
}