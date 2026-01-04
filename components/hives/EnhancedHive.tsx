import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, G, Line, LinearGradient, Polygon, Rect, Stop } from 'react-native-svg';
import { HiveInfoModal } from './HiveInfoModal';

interface EnhancedHiveProps {
  hive: {
    id: string;
    beeCount: number;
    health: number;
    position: { x: number; y: number };
  };
  activeCrops: { 
    cropId: string; 
    plotId: string; 
    growthStage: number; 
    position: { x: number; y: number } 
  }[];
  isSelected?: boolean;
  onPress?: () => void;
}

export function EnhancedHive({ hive, activeCrops, isSelected = false, onPress }: EnhancedHiveProps) {
  const [showModal, setShowModal] = useState(false);
  // Honey production removed
  
  const hiveInfo = null; // getHiveInfo(hive.id);
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
    setShowModal(true);
  };

  const getHealthColor = (health: number) => {
    if (health > 70) return '#22c55e';
    if (health > 40) return '#eab308';
    return '#ef4444';
  };

  const getProductionStatus = () => {
    // Honey production removed
    if (true) {
      return { status: 'Idle', color: '#8D6E63' };
    }
    
    // const batch = hiveInfo.hive.currentBatch;
    // Batch logic removed
    if (false) {
      return { status: 'Ready!', color: '#4CAF50' };
    }
    
    // Batch amount check removed
    if (false) {
      return { status: 'Active', color: '#FF8F00' };
    }
    
    return { status: 'Starting', color: '#FFB300' };
  };

  const productionStatus = getProductionStatus();

  return (
    <>
      <Pressable onPress={handlePress} style={styles.container}>
        <View style={[styles.hiveContainer, isSelected && styles.selected]}>
          <Svg width={80} height={80} viewBox="0 0 200 200" style={styles.svg}>
            <Defs>
              <LinearGradient id={`health-${hive.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={getHealthColor(hive.health)} />
                <Stop offset="100%" stopColor={getHealthColor(hive.health)} stopOpacity={0.7} />
              </LinearGradient>
            </Defs>

            {/* Main hexagon body */}
            <Polygon
              points="100,20 170,60 170,140 100,180 30,140 30,60"
              fill="#92400e"
              stroke="#78350f"
              strokeWidth="3"
            />

            {/* Entrance hole */}
            <Circle cx="100" cy="140" r="12" fill="#1a1a1a" stroke="#2d2d2d" strokeWidth="1" />

            {/* Health bar */}
            <Rect x="35" y="165" width="130" height="8" fill="#3d3d3d" stroke="#1a1a1a" strokeWidth="1" />
            <Rect
              x="35"
              y="165"
              width={(130 * hive.health) / 100}
              height="8"
              fill={`url(#health-${hive.id})`}
            />

            {/* Honey production indicator */}
            {/* Honey production display removed */}
            <Circle 
                cx="160" 
                cy="40" 
                r="8" 
                fill={productionStatus.color}
                stroke="#FFF"
                strokeWidth="2"
              />

            {/* Decorative honey frames */}
            <G opacity="0.6">
              <Line x1="60" y1="50" x2="140" y2="50" stroke="#d4a574" strokeWidth="1" />
              <Line x1="50" y1="85" x2="150" y2="85" stroke="#d4a574" strokeWidth="1" />
              <Line x1="50" y1="120" x2="150" y2="120" stroke="#d4a574" strokeWidth="1" />
            </G>
          </Svg>

          {/* Bee count overlay */}
          <View style={styles.overlay}>
            <Text style={styles.beeCount}>{hive.beeCount}</Text>
            <Text style={styles.beeLabel}>bees</Text>
          </View>

          {/* Production status */}
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: productionStatus.color }]} />
            <Text style={[styles.statusText, { color: productionStatus.color }]}>
              {productionStatus.status}
            </Text>
          </View>
        </View>
      </Pressable>

      {showModal && hiveInfo && (
        <HiveInfoModal
          hive={{
            id: hive.id,
            beeCount: hive.beeCount,
            completedBatches: []
          }}
          summary={{
            currentProduction: 'None',
            todaysCollection: '0ml', 
            totalHoney: 0,
            recentSources: [],
            qualityRating: 'N/A'
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 100,
    alignItems: 'center',
  },
  hiveContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  selected: {
    transform: [{ scale: 1.1 }],
  },
  svg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  overlay: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beeCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF8E1',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  beeLabel: {
    fontSize: 10,
    color: '#FFF8E1',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(255, 248, 225, 0.9)',
    borderRadius: 10,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
});