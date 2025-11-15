import { CROP_CONFIGS } from '../../lib/cropConfig';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SeedsTabProps {
  seeds: Record<string, number>;
}

export function SeedsTab({ seeds }: SeedsTabProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionIcon}>🌱</Text>
        <Text style={styles.sectionTitle}>Seeds</Text>
      </View>
      {Object.entries(seeds).map(([seed, count]) => {
        const config = CROP_CONFIGS[seed];
        return (
          <View key={seed} style={styles.cardSeed}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemEmoji}>{config?.emoji || '🌱'}</Text>
              <View>
                <Text style={styles.seedName}>{config?.name || seed} Seeds</Text>
                <Text style={styles.itemCategory}>{config?.category || 'seed'}</Text>
              </View>
            </View>
            <Text style={styles.seedCount}>{count}</Text>
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
  cardSeed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#FEF9C3',
    borderWidth: 2,
    borderColor: '#CA8A04',
    borderRadius: 8,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemEmoji: {
    fontSize: 32,
  },
  seedName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#78350F',
  },
  itemCategory: {
    fontSize: 11,
    color: '#92400E',
    opacity: 0.7,
  },
  seedCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
  },
});
