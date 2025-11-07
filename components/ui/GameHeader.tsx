import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Weather = 'sunny' | 'cloudy' | 'rainy';

type GameHeaderProps = {
  coins: number;
  water: number;
  weather: Weather;
  maxWater?: number;
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
  onHarvestClick,
  onShovelClick,
  canHarvest = false,
  canShovel = false,
  isHarvestSelected = false,
  isShovelSelected = false,
}: GameHeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const getWeatherIcon = () => {
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
      <View style={styles.leftSection}>
        <View style={styles.weatherBadge}>
          <Text style={styles.weatherIcon}>{getWeatherIcon()}</Text>
        </View>
        
        {/* Action buttons */}
        <View style={styles.actionButtons}>
          {/* Harvest button */}
          <TouchableOpacity
            onPress={onHarvestClick}
            disabled={!canHarvest}
            style={[
              styles.actionButton, 
              !canHarvest && styles.actionButtonDisabled,
              isHarvestSelected && styles.actionButtonSelected
            ]}
          >
            <Text style={styles.actionIcon}>🌾</Text>
          </TouchableOpacity>
          
          {/* Shovel button */}
          <TouchableOpacity
            onPress={onShovelClick}
            disabled={!canShovel}
            style={[
              styles.actionButton, 
              !canShovel && styles.actionButtonDisabled,
              isShovelSelected && styles.actionButtonSelected
            ]}
          >
            <Text style={styles.actionIcon}>🪓</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.rightSection}>
        {/* Water balance */}
        <View style={[styles.waterBadge, { backgroundColor: waterColor, borderColor: waterBorderColor }]}>
          <Text style={styles.waterIcon}>💧</Text>
          <Text style={styles.badgeText}>{water}/{maxWater}</Text>
        </View>

        {/* Coins */}
        <View style={styles.coinBadge}>
          <Text style={styles.coinIcon}>🪙</Text>
          <Text style={styles.badgeText}>{coins}</Text>
        </View>

        {/* Avatar with dropdown */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity
            onPress={() => setShowDropdown(!showDropdown)}
            style={styles.avatarButton}
          >
            <Text style={styles.avatarIcon}>👤</Text>
          </TouchableOpacity>

          {showDropdown && (
            <>
              <TouchableOpacity
                style={styles.dropdownOverlay}
                activeOpacity={1}
                onPress={() => setShowDropdown(false)}
              />
              <View style={styles.dropdown}>
                <TouchableOpacity style={styles.dropdownItem}>
                  <Text style={styles.dropdownItemText}>👤 Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dropdownItem}>
                  <Text style={styles.dropdownItemText}>⚙️ Settings</Text>
                </TouchableOpacity>
                <View style={styles.dropdownDivider} />
                <TouchableOpacity style={styles.dropdownItem}>
                  <Text style={styles.dropdownItemLogout}>🚪 Log Out</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(120, 53, 15, 0.9)',
    zIndex: 20,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4ade80',
    borderWidth: 3,
    borderColor: '#166534',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  actionButtonDisabled: {
    backgroundColor: '#57534e',
    borderColor: '#292524',
    opacity: 0.5,
  },
  actionButtonSelected: {
    borderWidth: 4,
    borderColor: '#facc15',
    shadowColor: '#facc15',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  actionIcon: {
    fontSize: 24,
  },
  weatherBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 3,
    borderColor: '#fbbf24',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  weatherIcon: {
    fontSize: 28,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  waterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#1e3a8a',
    gap: 8,
    minWidth: 80,
  },
  waterIcon: {
    fontSize: 18,
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#78350f',
    gap: 8,
    minWidth: 80,
  },
  coinIcon: {
    fontSize: 18,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1c1917',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f59e0b',
    borderWidth: 3,
    borderColor: '#78350f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIcon: {
    fontSize: 26,
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 30,
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: 48,
    width: 192,
    backgroundColor: '#fef3c7',
    borderWidth: 2,
    borderColor: '#78350f',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 40,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#78350f',
  },
  dropdownItemLogout: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#fcd34d',
  },
});
