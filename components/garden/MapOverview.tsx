import type { MapData } from '../../types/maps';
import React from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MapOverviewProps {
  visible: boolean;
  onClose: () => void;
  maps: MapData[];
  activeMapId: string;
  onSelectMap: (mapId: string) => void;
}

/**
 * MapOverview - Full-screen modal showing all unlocked maps
 * Activated by pinch-out gesture on main screen
 */
export function MapOverview({ visible, onClose, maps, activeMapId, onSelectMap }: MapOverviewProps) {
  const unlockedMaps = maps.filter(m => m.unlocked);
  const screenWidth = Dimensions.get('window').width;
  
  // Calculate grid layout (2 columns)
  const cardWidth = (screenWidth - 48) / 2;

  const handleMapSelect = (mapId: string) => {
    onSelectMap(mapId);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Your Maps</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Map Grid */}
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.grid}>
              {unlockedMaps.map((map) => (
                <TouchableOpacity
                  key={map.id}
                  style={[
                    styles.mapTile,
                    { width: cardWidth },
                    map.id === activeMapId && styles.mapTileActive,
                  ]}
                  onPress={() => handleMapSelect(map.id)}
                >
                  {/* Background Gradient Effect */}
                  <View 
                    style={[
                      styles.mapBackground,
                      { backgroundColor: map.colors.secondary }
                    ]}
                  />

                  {/* Active Badge */}
                  {map.id === activeMapId && (
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>✓</Text>
                    </View>
                  )}

                  {/* Map Icon */}
                  <Text style={styles.mapIcon}>{map.icon}</Text>

                  {/* Map Name */}
                  <Text style={styles.mapName}>{map.name}</Text>

                  {/* Multipliers Preview */}
                  <View style={styles.statsPreview}>
                    <View style={styles.statItem}>
                      <Text style={styles.statIcon}>🌡️</Text>
                      <Text style={styles.statValue}>
                        {map.multipliers.temperature.toFixed(1)}x
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statIcon}>💧</Text>
                      <Text style={styles.statValue}>
                        {map.multipliers.humidity.toFixed(1)}x
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statIcon}>🌱</Text>
                      <Text style={styles.statValue}>
                        {map.multipliers.growthRate.toFixed(1)}x
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Hint Text */}
            <Text style={styles.hintText}>
              Tap a map to switch to it. Unlock more maps in the Expand screen.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#92400e',
    borderRadius: 24,
    borderWidth: 4,
    borderColor: '#44403c',
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#78350f',
    borderBottomWidth: 3,
    borderBottomColor: '#44403c',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fef3c7',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#57534e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  mapTile: {
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#1c1917',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  mapTileActive: {
    borderColor: '#facc15',
    borderWidth: 4,
  },
  mapBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  activeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeBadgeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mapIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  mapName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1c1917',
    textAlign: 'center',
    marginBottom: 8,
  },
  statsPreview: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 12,
  },
  statValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1c1917',
  },
  hintText: {
    fontSize: 12,
    color: '#d6d3d1',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});
