import type { MapData } from '../../types/maps';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MapCardProps {
  map: MapData;
  onUnlock?: (mapId: string) => void;
  onSelect?: (mapId: string) => void;
  currentCoins?: number;
  isActive?: boolean;
}

/**
 * MapCard - Displays a map with its stats and unlock/select functionality
 */
export function MapCard({ map, onUnlock, onSelect, currentCoins = 0, isActive = false }: MapCardProps) {
  const canAfford = currentCoins >= map.unlockCost;
  const isUnlocked = map.unlocked;
  const isDefault = map.id === 'default';

  const handlePress = () => {
    if (!isUnlocked && onUnlock) {
      onUnlock(map.id);
    } else if (isUnlocked && onSelect) {
      onSelect(map.id);
    }
  };

  const getMultiplierColor = (value: number): string => {
    if (value > 1.0) return '#22c55e'; // Green for positive
    if (value < 1.0) return '#ef4444'; // Red for negative
    return '#6b7280'; // Gray for neutral
  };

  const formatMultiplier = (value: number): string => {
    const percentage = ((value - 1) * 100).toFixed(0);
    if (value > 1.0) return `+${percentage}%`;
    if (value < 1.0) return `${percentage}%`;
    return 'Base';
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isActive && styles.cardActive,
        !isUnlocked && !isDefault && styles.cardLocked,
      ]}
      onPress={handlePress}
      disabled={!isUnlocked && !canAfford}
    >
      <LinearGradient
        colors={[map.colors.primary, map.colors.secondary, map.colors.tertiary]}
        style={styles.gradient}
      >
        {/* Lock Overlay */}
        {!isUnlocked && !isDefault && (
          <View style={styles.lockOverlay}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        )}

        {/* Active Indicator */}
        {isActive && (
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>ACTIVE</Text>
          </View>
        )}

        {/* Map Icon and Name */}
        <View style={styles.header}>
          <Text style={styles.icon}>{map.icon}</Text>
          <Text style={styles.name}>{map.name}</Text>
        </View>

        {/* Description */}
        <Text style={styles.description}>{map.description}</Text>
        
        {/* Texture Description */}
        <Text style={styles.textureDescription}>{map.textureDescription}</Text>

        {/* Multipliers */}
        <View style={styles.multipliers}>
          <View style={styles.multiplierItem}>
            <Text style={styles.multiplierIcon}>🌡️</Text>
            <Text style={styles.multiplierLabel}>Temp</Text>
            <Text style={[styles.multiplierValue, { color: getMultiplierColor(map.multipliers.temperature) }]}>
              {formatMultiplier(map.multipliers.temperature)}
            </Text>
          </View>

          <View style={styles.multiplierItem}>
            <Text style={styles.multiplierIcon}>💧</Text>
            <Text style={styles.multiplierLabel}>Humidity</Text>
            <Text style={[styles.multiplierValue, { color: getMultiplierColor(map.multipliers.humidity) }]}>
              {formatMultiplier(map.multipliers.humidity)}
            </Text>
          </View>

          <View style={styles.multiplierItem}>
            <Text style={styles.multiplierIcon}>🌱</Text>
            <Text style={styles.multiplierLabel}>Growth</Text>
            <Text style={[styles.multiplierValue, { color: getMultiplierColor(map.multipliers.growthRate) }]}>
              {formatMultiplier(map.multipliers.growthRate)}
            </Text>
          </View>
        </View>

        {/* Action Button */}
        {!isUnlocked && !isDefault && (
          <View style={styles.unlockSection}>
            <TouchableOpacity
              style={[
                styles.unlockButton,
                !canAfford && styles.unlockButtonDisabled,
              ]}
              onPress={handlePress}
              disabled={!canAfford}
            >
              <Text style={styles.unlockButtonText}>
                🪙 Unlock - {map.unlockCost} coins
              </Text>
              {!canAfford && (
                <Text style={styles.unlockButtonSubtext}>
                  Need {map.unlockCost - currentCoins} more
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {isUnlocked && !isActive && (
          <View style={styles.selectSection}>
            <Text style={styles.selectHint}>Tap to select this map</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#1c1917',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardActive: {
    borderColor: '#facc15',
    borderWidth: 4,
  },
  cardLocked: {
    opacity: 0.7,
  },
  gradient: {
    padding: 16,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  lockIcon: {
    fontSize: 48,
  },
  activeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#facc15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1c1917',
    zIndex: 2,
  },
  activeBadgeText: {
    color: '#1c1917',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 32,
    marginRight: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1c1917',
  },
  description: {
    fontSize: 14,
    color: '#44403c',
    marginBottom: 4,
  },
  textureDescription: {
    fontSize: 12,
    color: '#57534e',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  multipliers: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  multiplierItem: {
    alignItems: 'center',
  },
  multiplierIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  multiplierLabel: {
    fontSize: 10,
    color: '#44403c',
    marginBottom: 2,
  },
  multiplierValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  unlockSection: {
    marginTop: 8,
  },
  unlockButton: {
    backgroundColor: '#facc15',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1c1917',
    alignItems: 'center',
  },
  unlockButtonDisabled: {
    backgroundColor: '#a8a29e',
    opacity: 0.6,
  },
  unlockButtonText: {
    color: '#1c1917',
    fontSize: 16,
    fontWeight: 'bold',
  },
  unlockButtonSubtext: {
    color: '#44403c',
    fontSize: 12,
    marginTop: 4,
  },
  selectSection: {
    marginTop: 8,
    alignItems: 'center',
  },
  selectHint: {
    fontSize: 12,
    color: '#44403c',
    fontStyle: 'italic',
  },
});
