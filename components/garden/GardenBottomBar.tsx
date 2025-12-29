import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type NavigationBarProps = {
  onOpenAlmanac: () => void;
  onOpenInventory: () => void;
  onOpenShop: () => void;
  onOpenSettings: () => void;
};

export function GardenBottomBar({
  onOpenAlmanac,
  onOpenInventory,
  onOpenShop,
  onOpenSettings,
}: NavigationBarProps) {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#166534', '#14532d']} style={styles.background}>
        <View style={styles.navContent}>
          {/* Shop Icon */}
          <TouchableOpacity
            onPress={onOpenShop}
            activeOpacity={0.8}
            style={styles.navButtonWrapper}
          >
            <LinearGradient colors={['#dc2626', '#b91c1c']} style={styles.navButton}>
              <Text style={styles.navIcon}>🛍️</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Inventory Icon */}
          <TouchableOpacity
            onPress={onOpenInventory}
            activeOpacity={0.8}
            style={styles.navButtonWrapper}
          >
            <LinearGradient colors={['#b45309', '#92400e']} style={styles.navButton}>
              <Text style={styles.navIcon}>📦</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Almanac Icon */}
          <TouchableOpacity
            onPress={onOpenAlmanac}
            activeOpacity={0.8}
            style={styles.navButtonWrapper}
          >
            <LinearGradient colors={['#d97706', '#b45309']} style={styles.navButton}>
              <Text style={styles.navIcon}>📖</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Settings Icon */}
          <TouchableOpacity
            onPress={onOpenSettings}
            activeOpacity={0.8}
            style={styles.navButtonWrapper}
          >
            <LinearGradient colors={['#14532d', '#052e16']} style={styles.navButton}>
              <Text style={styles.navIcon}>⚙️</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 3,
    borderTopColor: '#44403c',
  },
  background: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  navContent: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    maxWidth: 500,
    alignSelf: 'center',
    gap: 8,
  },
  navButtonWrapper: {
    alignItems: 'center',
  },
  navButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#1c1917',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  navIcon: {
    fontSize: 28,
  },
});
