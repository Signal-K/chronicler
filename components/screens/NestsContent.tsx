import { useHiveState } from '../../hooks/useHiveState';
import { getQualityRating, usePollinatorQuality } from '../../hooks/usePollinatorQuality';
import type { HiveData, HiveType } from '../../types/hive';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HiveGrid } from '../hives/HiveGrid';
import { HiveSelectionModal } from '../hives/HiveSelectionModal';

export function NestsContent() {
  // State management
  const { hives, inventory, placeHive } = useHiveState();
  const [selectedPosition, setSelectedPosition] = useState<{ q: number; r: number } | null>(null);
  
  // Pollinator quality calculation
  const pollinatorQuality = usePollinatorQuality({
    hives,
    weather: {
      temperature: 22,
      precipitation: 10,
      windSpeed: 5,
      condition: 'sunny',
    },
    season: 'spring',
    airborneNectar: 60,
  });
  
  const qualityRating = getQualityRating(pollinatorQuality.overall);
  
  // Handle hive press
  const handleHivePress = (position: { q: number; r: number }, hive: HiveData | null) => {
    if (hive) {
      console.log('Tapped existing hive:', hive);
    } else {
      setSelectedPosition(position);
    }
  };
  
  const handleSelectHive = (hiveType: HiveType) => {
    if (!selectedPosition) return;
    placeHive(selectedPosition, hiveType);
    setSelectedPosition(null);
  };
  
  const handleCloseModal = () => {
    setSelectedPosition(null);
  };

  return (
    <>
      {/* Minimal Pollinator Quality Display */}
      <View style={styles.qualityBanner}>
        <View style={styles.qualityContent}>
          <Text style={styles.qualityEmoji}>{qualityRating.emoji}</Text>
          <View style={styles.qualityInfo}>
            <Text style={[styles.qualityScore, { color: qualityRating.color }]}>
              {pollinatorQuality.overall}
            </Text>
            <Text style={styles.qualityLabel}>Quality</Text>
          </View>
        </View>
      </View>
      
      {/* Hive Grid */}
      <HiveGrid 
        hives={hives}
        onHivePress={handleHivePress}
      />

      {/* Hive Selection Modal */}
      <HiveSelectionModal
        visible={selectedPosition !== null}
        inventory={inventory}
        onSelectHive={handleSelectHive}
        onClose={handleCloseModal}
        position={selectedPosition}
      />
    </>
  );
}

const styles = StyleSheet.create({
  qualityBanner: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#b45309',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 100,
  },
  qualityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qualityEmoji: {
    fontSize: 24,
  },
  qualityInfo: {
    alignItems: 'center',
  },
  qualityScore: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  qualityLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#78350f',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
