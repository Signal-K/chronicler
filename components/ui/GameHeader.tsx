import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Weather = 'sunny' | 'cloudy' | 'rainy';

type GameHeaderProps = {
  coins: number;
  water: number;
  weather: Weather;
  maxWater?: number;
  isDaytime?: boolean;
  onWeatherPress?: () => void;
  onOpenShop?: () => void;
  onHarvestClick?: () => void;
  onShovelClick?: () => void;
  canHarvest?: boolean;
  canShovel?: boolean;
  isHarvestSelected?: boolean;
  isShovelSelected?: boolean;
};

export function GameHeader({ 
  coins, 
  water, 
  weather, 
  maxWater = 100,
  isDaytime = true,
  onWeatherPress,
  onOpenShop,
}: GameHeaderProps) {
  const getWeatherIcon = () => {
    // Show moon at night, weather icons during day
    if (!isDaytime) {
      return '🌙';
    }
    
    switch (weather) {
      case 'rainy':
        return '🌧️';
      case 'cloudy':
        return '☁️';
      default:
        return '☀️';
    }
  };

  // Calculate water percentage for visual indicator
  const waterPercentage = Math.round((water / maxWater) * 100);
  const waterColor = waterPercentage > 50 ? '#dbeafe' : waterPercentage > 25 ? '#fef3c7' : '#fecaca';
  const waterBorderColor = waterPercentage > 50 ? '#1e3a8a' : waterPercentage > 25 ? '#d97706' : '#dc2626';

  return (
    <View style={styles.header}>
      {/* Weather */}
      <Pressable 
        style={({ pressed }) => [
          styles.weatherBadge, 
          pressed && styles.weatherBadgePressed
        ]} 
        onPress={onWeatherPress}
      >
        <Text style={styles.weatherIcon}>{getWeatherIcon()}</Text>
      </Pressable>

      {/* Water balance */}
      <View style={[styles.waterBadge, { backgroundColor: waterColor, borderColor: waterBorderColor }]}>
        <Text style={styles.waterIcon}>💧</Text>
        <Text style={styles.badgeText}>{water}/{maxWater}</Text>
      </View>

      {/* Coins */}
      <Pressable
        style={({ pressed }) => [styles.coinBadge, pressed && styles.weatherBadgePressed]}
        onPress={onOpenShop}
      >
        <Text style={styles.coinIcon}>🪙</Text>
        <Text style={styles.badgeText}>{coins}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: 'rgba(120, 53, 15, 0.9)',
    zIndex: 20,
    gap: 8,
  },
  weatherBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 2,
    borderColor: '#fbbf24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherBadgePressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  weatherIcon: {
    fontSize: 20,
  },
  waterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#1e3a8a',
    gap: 4,
    flex: 1,
    maxWidth: 120,
  },
  waterIcon: {
    fontSize: 14,
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#78350f',
    gap: 4,
    flex: 1,
    maxWidth: 100,
  },
  coinIcon: {
    fontSize: 14,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1c1917',
  },
});
