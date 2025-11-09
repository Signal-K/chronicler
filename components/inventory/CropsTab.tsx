import { CROP_CONFIGS } from '@/lib/cropConfig';
import { CROP_PRICES } from '@/types/inventory';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CropsTabProps {
  harvested: Record<string, number>;
  onSell: (crop: string) => void;
}

export function CropsTab({ harvested, onSell }: CropsTabProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionIcon}>🌾</Text>
        <Text style={styles.sectionTitle}>Harvested Crops</Text>
      </View>
      {Object.entries(harvested).map(([crop, count]) => {
        const config = CROP_CONFIGS[crop];
        const price = config?.sellPrice || CROP_PRICES[crop] || 10;
        
        return (
          <View key={crop} style={styles.cardCrop}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemEmoji}>{config?.emoji || '🌾'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.cropName}>{config?.name || crop}</Text>
                <Text style={styles.cropSell}>Sell for {price} coins</Text>
              </View>
            </View>
            <Text style={styles.cropCount}>{count}</Text>
            <TouchableOpacity
              onPress={() => onSell(crop)}
              disabled={count === 0}
              style={[styles.sellButton, count === 0 && styles.sellButtonDisabled]}
            >
              <Text style={styles.sellButtonEmoji}>💰</Text>
              <Text style={styles.sellButtonText}>Sell</Text>
            </TouchableOpacity>
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
  cropSell: {
    fontSize: 11,
    color: '#92400E',
    opacity: 0.7,
  },
  cropCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
    minWidth: 30,
    textAlign: 'center',
  },
  sellButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FBBF24',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#92400E',
  },
  sellButtonDisabled: {
    opacity: 0.5,
  },
  sellButtonEmoji: {
    fontSize: 14,
  },
  sellButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78350F',
  },
});
