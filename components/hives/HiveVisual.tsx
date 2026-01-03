import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Svg, { Defs, Path, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

interface HiveVisualProps {
  nectarLevel: number; // 0-100
  maxNectar: number;
  beeCount: number;
  hiveId: string;
}

export function HiveVisual({ nectarLevel, maxNectar, beeCount, hiveId }: HiveVisualProps) {
  // Calculate nectar percentage for drip visualization
  const nectarPercentage = (nectarLevel / maxNectar) * 100;
  
  // Determine how many drips to show based on nectar level
  const dripCount = Math.floor(nectarPercentage / 25); // 0-4 drips
  
  return (
    <View style={styles.container}>
      {/* Beehive structure - classic skep style */}
      <View style={styles.hiveBody}>
        {/* Roof/Top */}
        <View style={styles.roofContainer}>
          <LinearGradient
            colors={['#8B6914', '#6B5410']}
            style={styles.roof}
          />
        </View>

        {/* Hive layers with honey texture */}
        <View style={styles.layers}>
          {[0, 1, 2, 3, 4].map((layer) => (
            <View key={layer} style={styles.layerContainer}>
              <LinearGradient
                colors={['#FDB813', '#F5A623', '#E67E22']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.layer}
              >
                {/* Hexagon pattern overlay */}
                <View style={styles.hexPattern}>
                  <Text style={styles.hexText}>⬢ ⬢ ⬢</Text>
                </View>
                
                {/* Honey drips - show based on nectar level */}
                {layer < dripCount && (
                  <View style={styles.honeyDrips}>
                    <Svg height="20" width="100%" style={styles.dripSvg}>
                      <Defs>
                        <SvgLinearGradient id={`honeyGradient${layer}`} x1="0" y1="0" x2="0" y2="1">
                          <Stop offset="0" stopColor="#FFD700" stopOpacity="0.9" />
                          <Stop offset="1" stopColor="#FFA500" stopOpacity="0.7" />
                        </SvgLinearGradient>
                      </Defs>
                      {/* Drip shapes */}
                      <Path
                        d="M 20 0 Q 20 10, 18 15 Q 20 18, 22 15 Q 20 10, 20 0 Z"
                        fill={`url(#honeyGradient${layer})`}
                      />
                      <Path
                        d="M 50 2 Q 50 12, 48 17 Q 50 20, 52 17 Q 50 12, 50 2 Z"
                        fill={`url(#honeyGradient${layer})`}
                      />
                      <Path
                        d="M 80 1 Q 80 11, 78 16 Q 80 19, 82 16 Q 80 11, 80 1 Z"
                        fill={`url(#honeyGradient${layer})`}
                      />
                    </Svg>
                  </View>
                )}
              </LinearGradient>
              
              {/* Separation line */}
              <View style={styles.layerSeparator} />
            </View>
          ))}
        </View>

        {/* Entrance */}
        <View style={styles.entrance}>
          <LinearGradient
            colors={['#3E2723', '#1C0D09']}
            style={styles.entranceHole}
          />
        </View>
      </View>

      {/* Status indicators */}
      <View style={styles.statusContainer}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusEmoji}>🐝</Text>
          <Text style={styles.statusText}>{beeCount}/10</Text>
        </View>
        
        <View style={styles.statusBadge}>
          <Image
            source={require('../../assets/Sprites/Honey_Bottle.png')}
            style={styles.honeyBottleIcon}
            resizeMode="contain"
          />
          <Text style={styles.statusText}>{Math.floor(nectarPercentage)}%</Text>
        </View>
      </View>

      {/* Nectar level bar */}
      <View style={styles.nectarBarContainer}>
        <View style={styles.nectarBarBackground}>
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.nectarBarFill, { width: `${nectarPercentage}%` }]}
          />
        </View>
        <Text style={styles.nectarLabel}>Nectar: {nectarLevel}/{maxNectar}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 8,
    width: '100%',
  },
  hiveBody: {
    width: '100%',
    maxWidth: 180,
    alignItems: 'center',
  },
  roofContainer: {
    width: '100%',
    height: 30,
    marginBottom: -4,
    zIndex: 10,
  },
  roof: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    borderWidth: 2,
    borderColor: '#5D4E37',
  },
  layers: {
    width: '90%',
    gap: 1,
  },
  layerContainer: {
    position: 'relative',
  },
  layer: {
    height: 32,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#8B6914',
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  hexPattern: {
    opacity: 0.3,
  },
  hexText: {
    fontSize: 12,
    color: '#6B5410',
    textAlign: 'center',
    letterSpacing: 1,
  },
  honeyDrips: {
    position: 'absolute',
    bottom: -15,
    left: 0,
    right: 0,
    height: 15,
  },
  dripSvg: {
    position: 'absolute',
    bottom: 0,
  },
  layerSeparator: {
    height: 1,
    backgroundColor: '#8B6914',
    opacity: 0.5,
  },
  entrance: {
    marginTop: 6,
    width: 45,
    height: 30,
  },
  entranceHole: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#3E2723',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#8B6914',
    gap: 4,
  },
  statusEmoji: {
    fontSize: 14,
  },
  honeyBottleIcon: {
    width: 18,
    height: 24,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#5D4E37',
  },
  nectarBarContainer: {
    marginTop: 8,
    width: '100%',
    maxWidth: 180,
  },
  nectarBarBackground: {
    height: 16,
    backgroundColor: '#E8DCC8',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#8B6914',
    overflow: 'hidden',
  },
  nectarBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  nectarLabel: {
    marginTop: 3,
    textAlign: 'center',
    fontSize: 10,
    color: '#5D4E37',
    fontWeight: '600',
  },
});
