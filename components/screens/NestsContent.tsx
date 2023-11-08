import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { InventoryData } from '../../hooks/useGameState';
import { useHoneyOrders } from '../../hooks/useHoneyOrders';
import { useHoneyProduction } from '../../hooks/useHoneyProduction';
import { usePlayerExperience } from '../../hooks/usePlayerExperience';
import type { TutorialAction } from '../../hooks/useTutorial';
import { getCropConfig } from '../../lib/cropConfig';
import type { HiveData } from '../../types/hive';
import type { BottledHoney } from '../../types/inventory';
import type { HoneyOrder } from '../../types/honeyOrders';
import type { PollinationFactorData } from '../../types/pollinationFactor';

interface NestsContentProps {
  pollinationFactor: PollinationFactorData;
  canSpawnBees: boolean;
  hive: HiveData;
  hives?: HiveData[];
  onBuildHive?: () => void;
  canBuildHive?: boolean;
  hiveCost?: number;
  coinBalance?: number;
  hiveNectarLevels?: Record<string, number>; // Track nectar per hive
  maxNectar?: number;
  inventory?: InventoryData;
  onInventoryUpdate?: (inventory: InventoryData) => void;
  onNectarUpdate?: (nectarLevels: Record<string, number>) => void;
  onTutorialAction?: (action: TutorialAction) => void;
  isTutorialActive?: boolean;
}

// Get gradient colors based on crop proportions from hive data
const getHoneyGradientColors = (hive: HiveData): string[] => {
  const harvests = hive.honey?.dailyHarvests || [];
  const today = new Date().toDateString();
  
  const todaysHarvests = harvests.filter(harvest => 
    new Date(harvest.timestamp).toDateString() === today && harvest.cropId !== 'virtual_boost'
  );

  // If no real harvests but hive has honey bottles (force daytime mode), show golden gradient
  if (todaysHarvests.length === 0) {
    const honeyBottles = hive.honey?.honeyBottles || 0;
    if (honeyBottles > 0) {
      return ['#fbbf24', '#f59e0b', '#d97706']; // Golden gradient for force daytime mode
    }
    return ['#e5e7eb', '#e5e7eb']; // Grey if no harvests and no honey
  }

  // Count crop proportions
  const cropCounts: Record<string, number> = {};
  todaysHarvests.forEach(harvest => {
    const effectiveAmount = harvest.halved ? harvest.amount * 0.5 : harvest.amount;
    cropCounts[harvest.cropId] = (cropCounts[harvest.cropId] || 0) + effectiveAmount;
  });

  // Get colors from crop configs
  const colors: string[] = [];
  const sortedCrops = Object.entries(cropCounts)
    .sort((a, b) => b[1] - a[1]) // Sort by amount
    .slice(0, 3); // Take top 3 crops

  sortedCrops.forEach(([cropId, _]) => {
    const config = getCropConfig(cropId);
    if (config && config.nectar?.honeyProfile?.color) {
      colors.push(config.nectar.honeyProfile.color);
    }
  });

  // Default to golden if no colors found
  if (colors.length === 0) {
    return ['#fbbf24', '#f59e0b'];
  }

  // Ensure at least 2 colors for gradient
  if (colors.length === 1) {
    colors.push(colors[0]);
  }

  return colors;
};

export function NestsContent({ 
  pollinationFactor, 
  canSpawnBees, 
  hive, 
  hives = [hive],
  onBuildHive,
  canBuildHive = false,
  hiveCost = 100,
  coinBalance = 0,
  hiveNectarLevels = {},
  maxNectar = 100,
  inventory,
  onInventoryUpdate,
  onNectarUpdate,
  onTutorialAction,
  isTutorialActive = false,
}: NestsContentProps) {
  const { experience, loading } = usePlayerExperience();
  const [selectedHive, setSelectedHive] = useState<HiveData | null>(null);
  
  // Honey production and orders for the detail modal
  const honeyProduction = useHoneyProduction();
  const { 
    orders, 
    fulfillOrder, 
    refreshDailyOrders, 
  } = useHoneyOrders();
  
  // Local state for bottled honey
  const [bottledHoney, setBottledHoney] = useState<BottledHoney[]>([]);
  
  // Load bottled honey from storage
  useEffect(() => {
    const loadBottledHoney = async () => {
      try {
        const stored = await AsyncStorage.getItem('bottled_honey');
        if (stored) {
          setBottledHoney(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading bottled honey:', error);
      }
    };
    loadBottledHoney();
  }, [selectedHive]);
  
  // Refresh orders when modal opens
  useEffect(() => {
    if (selectedHive && inventory) {
      // During tutorial, include amber honey so order matches the sunflower honey we gave
      const tutorialBottles: BottledHoney[] = isTutorialActive 
        ? [{ id: 'tutorial-amber', type: 'amber', color: '#fbbf24', amount: 1 }]
        : [];
      refreshDailyOrders([...bottledHoney, ...tutorialBottles], ['sunflower']);
    }
  }, [selectedHive, bottledHoney, inventory, refreshDailyOrders, isTutorialActive]);
  
  // Local orders state that syncs with hook
  const [ordersState, setOrdersState] = useState<HoneyOrder[]>(orders);
  useEffect(() => {
    setOrdersState(orders);
  }, [orders]);

  // Handle hive tap with tutorial action reporting
  const handleHiveTap = (currentHive: HiveData) => {
    setSelectedHive(currentHive);
    onTutorialAction?.('tap-hive');
  };
  
  // Handle bottling honey
  const handleBottleHoney = useCallback(async () => {
    if (!selectedHive || !inventory) return;
    
    const glassBottles = (inventory.items?.glass_bottle as number) || 0;
    const honeyBottles = selectedHive.honey?.honeyBottles || 0;
    
    if (glassBottles === 0 || honeyBottles === 0) return;
    
    // Calculate how many we can bottle
    const bottlesToCollect = Math.min(glassBottles, Math.floor(honeyBottles));
    if (bottlesToCollect === 0) return;
    
    // Get honey type info
    const { dominant } = honeyProduction.calculateHoneyProgress(selectedHive);
    let honeyTypeString: 'light' | 'amber' | 'dark' | 'specialty' | 'wildflower' = 'wildflower';
    
    if (dominant) {
      const config = getCropConfig(dominant);
      if (config?.nectar?.honeyProfile) {
        honeyTypeString = config.nectar.honeyProfile.type as any;
      }
    }
    
    // Create new bottled honey entries
    const newBottledHoney: BottledHoney[] = [];
    const honeyColors: Record<string, string> = {
      light: '#fef3c7',
      amber: '#fbbf24',
      dark: '#92400e',
      specialty: '#c084fc',
      wildflower: '#fcd34d',
    };
    for (let i = 0; i < bottlesToCollect; i++) {
      newBottledHoney.push({
        id: `bottle-${Date.now()}-${i}`,
        type: honeyTypeString,
        color: honeyColors[honeyTypeString] || '#fcd34d',
        amount: 1,
      });
    }
    
    // Update bottled honey storage
    const updatedBottledHoney = [...bottledHoney, ...newBottledHoney];
    setBottledHoney(updatedBottledHoney);
    await AsyncStorage.setItem('bottled_honey', JSON.stringify(updatedBottledHoney));
    
    // Update inventory (use glass bottles)
    const updatedInventory = {
      ...inventory,
      items: {
        ...inventory.items,
        glass_bottle: glassBottles - bottlesToCollect,
      },
    };
    onInventoryUpdate?.(updatedInventory);
    
    // Update hive honey bottles in storage
    try {
      const stored = await AsyncStorage.getItem('hives');
      if (stored) {
        const hivesData = JSON.parse(stored);
        const updatedHives = hivesData.map((h: HiveData) => {
          if (h.id === selectedHive.id) {
            return {
              ...h,
              honey: {
                ...h.honey,
                honeyBottles: Math.max(0, (h.honey?.honeyBottles || 0) - bottlesToCollect),
              },
            };
          }
          return h;
        });
        await AsyncStorage.setItem('hives', JSON.stringify(updatedHives));
        await AsyncStorage.setItem('hivesRefreshSignal', Date.now().toString());
        
        // Update local selected hive state
        setSelectedHive(prev => prev ? {
          ...prev,
          honey: {
            ...prev.honey!,
            honeyBottles: Math.max(0, (prev.honey?.honeyBottles || 0) - bottlesToCollect),
          },
        } : null);
      }
    } catch (error) {
      console.error('Error updating hive after bottling:', error);
    }
    
    // Report tutorial action
    onTutorialAction?.('bottle-honey');
    
    console.log(`🍯 Bottled ${bottlesToCollect} bottles of ${honeyTypeString} honey`);
  }, [selectedHive, inventory, bottledHoney, honeyProduction, onInventoryUpdate, onTutorialAction]);
  
  // Handle fulfilling an order
  const handleFulfillOrder = useCallback(async (orderId: string) => {
    if (!inventory) return;
    
    const glassBottles = (inventory.items?.glass_bottle as number) || 0;
    const result = fulfillOrder(orderId, bottledHoney, glassBottles);
    
    if (result.success) {
      // Update inventory with coins earned
      const updatedInventory = {
        ...inventory,
        coins: inventory.coins + result.coinsEarned,
      };
      onInventoryUpdate?.(updatedInventory);
      
      // Remove used honey from bottled honey
      const order = ordersState.find((o: HoneyOrder) => o.id === orderId);
      if (order) {
        let remaining = order.bottlesRequested;
        const updatedBottledHoney = bottledHoney.filter(h => {
          if (h.type === order.honeyType && remaining > 0) {
            remaining--;
            return false;
          }
          return true;
        });
        setBottledHoney(updatedBottledHoney);
        await AsyncStorage.setItem('bottled_honey', JSON.stringify(updatedBottledHoney));
      }
      
      // Report tutorial action
      onTutorialAction?.('fulfill-order');
      
      console.log(`📦 Order fulfilled! Earned ${result.coinsEarned} coins and ${result.xpEarned} XP`);
    }
  }, [inventory, bottledHoney, fulfillOrder, ordersState, onInventoryUpdate, onTutorialAction]);

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Dashboard Row - Compact Stats */}
      <View style={styles.dashboardRow}>
        {/* Experience Card */}
        <TouchableOpacity style={styles.dashboardCard} activeOpacity={0.85}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardEmoji}>⭐</Text>
            <Text style={styles.cardTitle}>Experience</Text>
          </View>
          <View style={styles.experienceContent}>
            {loading ? (
              <Text style={styles.loadingText}>Loading...</Text>
            ) : experience ? (
              <>
                <Text style={styles.levelNumber}>Level {experience.level}</Text>
                <View style={styles.experienceBar}>
                  <View style={[styles.experienceProgress, { width: `${(experience.progress || 0) * 100}%` }]} />
                </View>
                <Text style={styles.smallStat}>
                  {experience.totalXP} Total XP
                </Text>
              </>
            ) : (
              <Text style={styles.errorText}>Error loading</Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Pollination Card */}
        <View style={styles.dashboardCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardEmoji}>🌸</Text>
            <Text style={styles.cardTitle}>Pollination</Text>
          </View>
          
          <View style={styles.pollinationContent}>
            <Text style={styles.bigNumber}>{pollinationFactor.factor}</Text>
            {canSpawnBees && (
              <View style={styles.readyBadge}>
                <Text style={styles.readyText}>Bees Ready!</Text>
              </View>
            )}
            <Text style={styles.smallStat}>
              {pollinationFactor.totalHarvests} / {pollinationFactor.threshold} Harvests
            </Text>
          </View>
        </View>
      </View>

      {/* Hives List */}
      <View style={styles.hivesList}>
        {hives.map((currentHive, index) => (
          <TouchableOpacity
            key={currentHive.id}
            style={styles.hiveCard}
            onPress={() => handleHiveTap(currentHive)}
            activeOpacity={0.85}
          >
            <View style={styles.hiveHeader}>
              <Text style={styles.hiveTitle}>Beehive {index + 1}</Text>
              {currentHive.beeCount >= 10 && (
                <View style={styles.fullBadgeCompact}>
                  <Text style={styles.fullBadgeText}>FULL</Text>
                </View>
              )}
            </View>
            
            {/* Simplified hive visual since complex components were deleted */}
            <View style={styles.hiveVisual}>
              <View style={styles.hiveStats}>
                <View style={styles.beeCountRow}>
                  <Image 
                    source={require('../../assets/Sprites/Bee.png')}
                    style={styles.beeSpriteSmall}
                    resizeMode="contain"
                  />
                <View style={styles.beeCountRow}>
                  <Image 
                    source={require('../../assets/Sprites/Bee.png')}
                    style={styles.beeSpriteSmall}
                    resizeMode="contain"
                  />
                  <Text style={styles.beeCount}> {currentHive.beeCount}/10</Text>
                </View>
                </View>
                <View style={styles.honeyBar}>
                  <LinearGradient
                    colors={getHoneyGradientColors(currentHive) as [string, string, ...string[]]}
                    style={[styles.honeyBarFill, { width: `${((hiveNectarLevels[currentHive.id] || 0) / maxNectar) * 100}%` }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </View>
                <Text style={styles.nectarLevel}>🍯 {hiveNectarLevels[currentHive.id] || 0}/{maxNectar}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Build New Hive Button */}
        {onBuildHive && (
          <TouchableOpacity
            style={[
              styles.buildCard,
              !canBuildHive && styles.disabledBuildCard
            ]}
            onPress={onBuildHive}
            disabled={!canBuildHive}
          >
            <Text style={styles.buildEmoji}>🏗️</Text>
            <View>
              <Text style={styles.buildText}>Build New Hive</Text>
              <Text style={styles.costText}>💰 {hiveCost} coins</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Bottom padding for scrolling past bottom bar */}
      <View style={{ height: 100 }} />
      
      {/* Hive Detail Modal */}
      <Modal
        visible={selectedHive !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedHive(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🏠 Hive Details</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setSelectedHive(null)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {selectedHive && (
              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                {/* Hive Stats */}
                <View style={styles.hiveStatsSection}>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>🐝 Bees</Text>
                    <Text style={styles.statValue}>{selectedHive.beeCount}/10</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>🍯 Honey</Text>
                    <Text style={styles.statValue}>{Math.floor(selectedHive.honey?.honeyBottles || 0)}/15 bottles</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>📦 Glass Bottles</Text>
                    <Text style={styles.statValue}>{(inventory?.items?.glass_bottle as number) || 0}</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>🫙 Bottled Honey</Text>
                    <Text style={styles.statValue}>{bottledHoney.length}</Text>
                  </View>
                </View>
                
                {/* Honey Bar */}
                <View style={styles.honeySection}>
                  <Text style={styles.sectionTitle}>Honey Production</Text>
                  <View style={styles.honeyBarLarge}>
                    <LinearGradient
                      colors={getHoneyGradientColors(selectedHive) as [string, string, ...string[]]}
                      style={[
                        styles.honeyBarFillLarge, 
                        { width: `${Math.min(100, ((selectedHive.honey?.honeyBottles || 0) / 15) * 100)}%` }
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  </View>
                  
                  {/* Bottle Honey Button */}
                  <TouchableOpacity
                    style={[
                      styles.bottleButton,
                      ((selectedHive.honey?.honeyBottles || 0) < 1 || ((inventory?.items?.glass_bottle as number) || 0) === 0) && styles.bottleButtonDisabled
                    ]}
                    onPress={handleBottleHoney}
                    disabled={(selectedHive.honey?.honeyBottles || 0) < 1 || ((inventory?.items?.glass_bottle as number) || 0) === 0}
                  >
                    <Text style={styles.bottleButtonText}>
                      {((inventory?.items?.glass_bottle as number) || 0) === 0 
                        ? '🫙 No Glass Bottles' 
                        : (selectedHive.honey?.honeyBottles || 0) < 1 
                          ? '🍯 Hive Not Ready' 
                          : '🍯 Bottle Honey'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {/* Orders Section */}
                <View style={styles.ordersSection}>
                  <Text style={styles.sectionTitle}>📋 Daily Orders</Text>
                  {ordersState.length === 0 ? (
                    <View style={styles.noOrders}>
                      <Text style={styles.noOrdersText}>No orders yet today</Text>
                    </View>
                  ) : (
                    ordersState.map((order: HoneyOrder) => {
                      const matchingHoney = bottledHoney.filter(h => h.type === order.honeyType);
                      const canFulfill = matchingHoney.length >= order.bottlesRequested && !order.isCompleted;
                      
                      return (
                        <View 
                          key={order.id} 
                          style={[
                            styles.orderCard,
                            order.isCompleted && styles.orderCardCompleted,
                            canFulfill && styles.orderCardReady,
                          ]}
                        >
                          <View style={styles.orderHeader}>
                            <Text style={styles.orderEmoji}>{order.characterEmoji}</Text>
                            <View style={styles.orderInfo}>
                              <Text style={styles.orderName}>{order.characterName}</Text>
                              <Text style={styles.orderRequest}>
                                Wants {order.bottlesRequested}× {order.honeyType} honey
                              </Text>
                            </View>
                          </View>
                          <View style={styles.orderRewards}>
                            <Text style={styles.orderReward}>🪙 {order.coinReward}</Text>
                            <Text style={styles.orderReward}>⭐ +{order.xpReward} XP</Text>
                          </View>
                          {order.isCompleted ? (
                            <View style={styles.completedBadge}>
                              <Text style={styles.completedText}>✓ Completed</Text>
                            </View>
                          ) : (
                            <TouchableOpacity
                              style={[
                                styles.fulfillButton,
                                !canFulfill && styles.fulfillButtonDisabled,
                              ]}
                              onPress={() => handleFulfillOrder(order.id)}
                              disabled={!canFulfill}
                            >
                              <Text style={[
                                styles.fulfillButtonText,
                                !canFulfill && styles.fulfillButtonTextDisabled,
                              ]}>
                                {canFulfill ? '📦 Fulfill' : `Need ${order.bottlesRequested} ${order.honeyType}`}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      );
                    })
                  )}
                </View>
                
                {/* Bottled Honey Inventory */}
                {bottledHoney.length > 0 && (
                  <View style={styles.inventorySection}>
                    <Text style={styles.sectionTitle}>🫙 Your Bottled Honey</Text>
                    <View style={styles.honeyInventory}>
                      {['light', 'amber', 'dark', 'specialty', 'wildflower'].map(type => {
                        const count = bottledHoney.filter(h => h.type === type).length;
                        if (count === 0) return null;
                        return (
                          <View key={type} style={styles.honeyTypeItem}>
                            <Text style={styles.honeyTypeEmoji}>🍯</Text>
                            <Text style={styles.honeyTypeName}>{type}</Text>
                            <Text style={styles.honeyTypeCount}>×{count}</Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                )}
                
                <View style={{ height: 40 }} />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef3c7',
  },
  contentContainer: {
    padding: 12,
    gap: 12,
  },
  dashboardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dashboardCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: '#d97706',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  cardEmoji: {
    fontSize: 18,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400e',
  },
  experienceContent: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  levelNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 4,
  },
  experienceBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  experienceProgress: {
    height: '100%',
    backgroundColor: '#10b981',
  },
  pollinationContent: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  bigNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#b45309',
  },
  readyBadge: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 4,
  },
  readyText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  smallStat: {
    fontSize: 11,
    color: '#78350f',
    fontWeight: '600',
  },
  hivesList: {
    gap: 16,
  },
  hiveCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#92400e',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  hiveHeader: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  hiveTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400e',
  },
  fullBadgeCompact: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  fullBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  hiveVisual: {
    width: '100%',
    alignItems: 'center',
  },
  hiveStats: {
    alignItems: 'center',
    gap: 8,
  },
  beeCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
  },
  beeCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  beeSpriteSmall: {
    width: 32,
    height: 32,
  },
  honeyBar: {
    width: 200,
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  honeyBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  nectarLevel: {
    fontSize: 14,
    color: '#b45309',
  },
  buildCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#92400e',
    borderStyle: 'dashed',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  disabledBuildCard: {
    opacity: 0.6,
    borderColor: '#9ca3af',
  },
  buildEmoji: {
    fontSize: 24,
  },
  buildText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
  },
  costText: {
    fontSize: 14,
    color: '#b45309',
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 12,
    color: '#78350f',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
    textAlign: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fef3c7',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#d97706',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92400e',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#dc2626',
  },
  modalScroll: {
    padding: 16,
  },
  hiveStatsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#d97706',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#fef3c7',
  },
  statLabel: {
    fontSize: 14,
    color: '#78350f',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400e',
  },
  honeySection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#d97706',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 12,
  },
  honeyBarLarge: {
    height: 20,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
  },
  honeyBarFillLarge: {
    height: '100%',
    borderRadius: 10,
  },
  bottleButton: {
    backgroundColor: '#fbbf24',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  bottleButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  bottleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#78350f',
  },
  ordersSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#d97706',
  },
  noOrders: {
    padding: 20,
    alignItems: 'center',
  },
  noOrdersText: {
    color: '#78350f',
    fontSize: 14,
  },
  orderCard: {
    backgroundColor: '#fef9c3',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  orderCardCompleted: {
    opacity: 0.6,
    borderColor: '#10b981',
  },
  orderCardReady: {
    borderColor: '#10b981',
    borderWidth: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderEmoji: {
    fontSize: 28,
    marginRight: 10,
  },
  orderInfo: {
    flex: 1,
  },
  orderName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400e',
  },
  orderRequest: {
    fontSize: 12,
    color: '#78350f',
  },
  orderRewards: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  orderReward: {
    fontSize: 12,
    color: '#b45309',
    fontWeight: '600',
  },
  completedBadge: {
    backgroundColor: '#d1fae5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  completedText: {
    color: '#065f46',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fulfillButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  fulfillButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  fulfillButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fulfillButtonTextDisabled: {
    color: '#6b7280',
  },
  inventorySection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#d97706',
  },
  honeyInventory: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  honeyTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef9c3',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 4,
  },
  honeyTypeEmoji: {
    fontSize: 16,
  },
  honeyTypeName: {
    fontSize: 12,
    color: '#78350f',
    textTransform: 'capitalize',
  },
  honeyTypeCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#92400e',
  },
});