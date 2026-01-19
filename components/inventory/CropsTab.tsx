import { CROP_CONFIGS } from '../../lib/cropConfig';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CropsTabProps {
  harvested: Record<string, number>;
}

export function CropsTab({ harvested }: CropsTabProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionIcon}>🌾</Text>
        <Text style={styles.sectionTitle}>Harvested Crops</Text>
      </View>
      {Object.entries(harvested).map(([crop, count]) => {
        const config = CROP_CONFIGS[crop];
        
        return (
          <View key={crop} style={styles.cardCrop}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemEmoji}>{config?.emoji || '🌾'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.cropName}>{config?.name || crop}</Text>
              </View>
            </View>
            <Text style={styles.cropCount}>{count}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },
  cardCrop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#FEF9C3',
    borderWidth: 2,
    borderColor: '#059669',
    borderRadius: 8,
    gap: 12,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  itemEmoji: {
    fontSize: 32,
  },
  cropName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#78350F',
  },
  cropCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
    minWidth: 30,
    textAlign: 'center',
  },
});
