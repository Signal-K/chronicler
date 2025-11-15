import type { HiveInventory, HiveType } from '../../types/hive';
import React from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HiveSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectHive: (hiveType: HiveType) => void;
  inventory: HiveInventory;
  position: { q: number; r: number } | null;
}

export function HiveSelectionModal({ 
  visible, 
  onClose, 
  onSelectHive, 
  inventory,
  position 
}: HiveSelectionModalProps) {
  
  const hiveTypes: {
    type: Exclude<HiveType, null>;
    name: string;
    emoji: string;
    description: string;
    stats: {
      capacity: string;
      difficulty: string;
      production: string;
    };
  }[] = [
    {
      type: 'standard',
      name: 'Standard Hive',
      emoji: '🏡',
      description: 'Basic wooden hive. Good for beginners.',
      stats: {
        capacity: 'Medium',
        difficulty: 'Easy',
        production: 'Normal',
      },
    },
    {
      type: 'langstroth',
      name: 'Langstroth Hive',
      emoji: '📦',
      description: 'Traditional box hive with removable frames. Industry standard.',
      stats: {
        capacity: 'High',
        difficulty: 'Medium',
        production: 'High',
      },
    },
    {
      type: 'top-bar',
      name: 'Top Bar Hive',
      emoji: '🪵',
      description: 'Horizontal hive allowing bees to build natural comb.',
      stats: {
        capacity: 'Medium',
        difficulty: 'Easy',
        production: 'Low-Medium',
      },
    },
    {
      type: 'warre',
      name: 'Warré Hive',
      emoji: '🗼',
      description: 'Vertical natural hive with minimal intervention.',
      stats: {
        capacity: 'Medium-High',
        difficulty: 'Hard',
        production: 'Medium-High',
      },
    },
    {
      type: 'flow',
      name: 'Flow Hive',
      emoji: '🚰',
      description: 'Modern hive with automatic honey extraction.',
      stats: {
        capacity: 'High',
        difficulty: 'Medium',
        production: 'Very High',
      },
    },
  ];

  const getAvailableCount = (type: Exclude<HiveType, null>): number => {
    return inventory.availableHives[type] || 0;
  };

  const isUnlocked = (type: HiveType): boolean => {
    return inventory.unlockedTypes.includes(type);
  };

  const canPlace = (type: Exclude<HiveType, null>): boolean => {
    return isUnlocked(type) && getAvailableCount(type) > 0;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Select Hive Type</Text>
            {position && (
              <Text style={styles.headerSubtitle}>
                Position: ({position.q}, {position.r})
              </Text>
            )}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Hive type list */}
          <ScrollView style={styles.hiveList} showsVerticalScrollIndicator={false}>
            {hiveTypes.map((hive) => {
              const available = canPlace(hive.type);
              const count = getAvailableCount(hive.type);
              const locked = !isUnlocked(hive.type);

              return (
                <TouchableOpacity
                  key={hive.type}
                  style={[
                    styles.hiveCard,
                    !available && styles.hiveCardDisabled,
                    locked && styles.hiveCardLocked,
                  ]}
                  onPress={() => available && onSelectHive(hive.type)}
                  disabled={!available}
                >
                  <View style={styles.hiveCardHeader}>
                    <Text style={styles.hiveEmoji}>{locked ? '🔒' : hive.emoji}</Text>
                    <View style={styles.hiveInfo}>
                      <Text style={[styles.hiveName, !available && styles.textDisabled]}>
                        {hive.name}
                      </Text>
                      <Text style={[styles.hiveDescription, !available && styles.textDisabled]}>
                        {locked ? 'Locked - Complete challenges to unlock' : hive.description}
                      </Text>
                    </View>
                    {!locked && (
                      <View style={styles.countBadge}>
                        <Text style={styles.countText}>{count}</Text>
                      </View>
                    )}
                  </View>

                  {!locked && (
                    <View style={styles.statsContainer}>
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Capacity</Text>
                        <Text style={styles.statValue}>{hive.stats.capacity}</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Difficulty</Text>
                        <Text style={styles.statValue}>{hive.stats.difficulty}</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Production</Text>
                        <Text style={styles.statValue}>{hive.stats.production}</Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Info footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              💡 Build more hives in the Shop or unlock new types by completing challenges
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fef3c7',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.8,
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#92400e',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#92400e',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#78350f',
    textAlign: 'center',
    marginTop: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#92400e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  hiveList: {
    padding: 16,
  },
  hiveCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#92400e',
  },
  hiveCardDisabled: {
    opacity: 0.5,
    borderColor: '#d1d5db',
  },
  hiveCardLocked: {
    backgroundColor: 'rgba(209, 213, 219, 0.5)',
    borderColor: '#9ca3af',
  },
  hiveCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  hiveEmoji: {
    fontSize: 48,
    marginRight: 12,
  },
  hiveInfo: {
    flex: 1,
  },
  hiveName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 4,
  },
  hiveDescription: {
    fontSize: 14,
    color: '#78350f',
    lineHeight: 18,
  },
  textDisabled: {
    color: '#9ca3af',
  },
  countBadge: {
    backgroundColor: '#22c55e',
    borderRadius: 16,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#166534',
  },
  countText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#92400e',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#78350f',
    marginBottom: 2,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '700',
  },
  footer: {
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#92400e',
    marginHorizontal: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#78350f',
    textAlign: 'center',
    lineHeight: 16,
  },
});
